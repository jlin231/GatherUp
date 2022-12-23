// backend/routes/api/session.js
const express = require('express')
const router = express.Router();

const { Group, User, Image, Venue, groupImage, venueGroup, groupUser } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

//PUT /api/groups/:groupId/venues
// Creates and returns a new venue for a group specified by its id

router.put('/:venueId', requireAuth, async (req, res, next) => {
    const { user } = req;
    const venueId = +req.params.venueId;
    const { address, city, state, lat, lng } = req.body;

    let venue = await Venue.findByPk(venueId);
    //error handling
    //handles if group is not found
    if (!venue) {
        let err = new Error("Venue couldn't be found");
        err.status = 404;
        err.message = "Venue couldn't be found"
        return next(err);
    };

    //handles user authorization, Current User must be the organizer of the group 
    //or a member of the group with a status of "co-host"

    //find group associated with venue
    let venueGroups = await venueGroup.findOne({
        where: {
            venueId: venueId
        }
    });
    let group = await Group.findByPk(venueGroups.groupId);

    //handles user authorization, Current User must be the organizer of the group 
    //or a member of the group with a status of "co-host"

    let groupUsers = await groupUser.findAll({
        where: {
            userId: user.id,
            groupId: venueGroups.groupId,
            status: 'co-host'
        }
    });
    if (groupUsers.length === 0 && user.id !== group.organizerId) {
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
    else if (!lat || !+lat || lat > 90 || lat < -90) {
        bodyErr.status = 400;
        bodyErr.errors = {
            "lat": "Latitude is not valid"
        }
        return next(bodyErr);
    }
    else if (!lng || !+lng || lng > 180 || lng < -180) {
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
    result.groupId = venueGroups.groupId;
    delete result.createdAt;
    delete result.updatedAt;

    return res.json(result)

});


module.exports = router;
