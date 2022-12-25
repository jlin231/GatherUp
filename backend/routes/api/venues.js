// backend/routes/api/session.js
const express = require('express')
const router = express.Router();

const { Group, User, Image, Venue, groupImage, venueGroup, Membership } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

//PUT /api/venues/:venueId
//Edit a new venue specified by its id

router.put('/:venueId', requireAuth, async (req, res, next) => {
    const { user } = req;
    const venueId = +req.params.venueId;
    const { address, city, state, lat, lng } = req.body;

    let venue = await Venue.findByPk(venueId);
    //error handling
    //handles if venue is not found
    if (!venue) {
        let err = new Error("Venue couldn't be found");
        err.status = 404;
        err.message = "Venue couldn't be found"
        return next(err);
    };

    //handles user authorization, Current User must be the organizer of the group 
    //or a member of the group with a status of "co-host"
    let group = await Group.findByPk(venue.groupId);

    let Memberships = await Membership.findAll({
        where: {
            userId: user.id,
            groupId: venue.groupId,
            status: 'co-host'
        }
    });
    if (Memberships.length === 0 && user.id !== group.organizerId) {
        let err = new Error("User is not a member and a co-host or an organizer.");
        err.status = 401;
        err.message = "User is not a member and a co-host or an organizer. authorization error"
        return next(err);
    }

    //handles body errors 
    let bodyErr = new Error("Validation error")
    if (!address) {
        bodyErr.status = 400;
        bodyErr.errors = {
            "address": "Street address is required"
        }
        return next(bodyErr);
    }
    else if (!city) {
        bodyErr.status = 400;
        bodyErr.errors = {
            "city": "City is required"
        }
        return next(bodyErr);
    }
    else if (!state) {
        bodyErr.status = 400;
        bodyErr.errors = {
            "state": "State is required"
        }
        return next(bodyErr);
    }
    else if (!lat || lng === true || lng === false || !+lat || lat > 90 || lat < -90) {
        bodyErr.status = 400;
        bodyErr.errors = {
            "lat": "Latitude is not valid"
        }
        return next(bodyErr);
    }
    else if (!lng || lng === true || lng === false || !+lng || lng > 180 || lng < -180) {
        bodyErr.status = 400;
        bodyErr.errors = {
            "lng": "Longitude is not valid"
        }
        return next(bodyErr);
    }

    //update venue
    await venue.update({
        address, city, state, lat, lng
    })

    //format result
    let result = venue.toJSON();
    delete result.createdAt;
    delete result.updatedAt;

    return res.json(result)
});


module.exports = router;
