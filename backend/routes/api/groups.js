// backend/routes/api/session.js
const express = require('express')
const router = express.Router();

const { Group, User, Attendance, GroupImage, Venue } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize');
const group = require('../../db/models/group');

// /api/groups GET Returns all the groups.DONE
router.get('/', async (req, res, next) => {
    console.log('test')
    let groups = await Group.findAll();
    const groupList = [];
    groups.forEach((group) => {
        groupList.push(group.toJSON())
    });
    //find attendees
    const attendees = await Attendance.findAll();
    let attendeeNumber = {};
    attendees.forEach((attendee) => {
        attendee = attendee.toJSON();
        if (!attendeeNumber[attendee.eventId]) {
            attendeeNumber[attendee.eventId] = 1;
        }
        else {
            attendeeNumber[attendee.eventId] += 1;
        }
    });

    //find preview images
    const images = await GroupImage.findAll();
    let previewImages = {}
    images.forEach((image) => {
        image = image.toJSON();
        if (image.preview === true) {
            previewImages[image.groupId] = image.url;
        }
    });

    //add preview images and urls to group output
    for (let i = 0; i < groupList.length; i++) {
        groupList[i].url = previewImages[groupList[i].id];
        groupList[i].numMembers = attendeeNumber[groupList[i].id];
    }

    let output = { "Groups": groupList }
    return res.json(output);
});

// /api/groups/current GET 
// Get all Groups joined or organized by the Current User
router.get('/current', requireAuth, async (req, res, next) => {
    let { user } = req;
    user = user.toJSON();

    let organized = await Group.findAll({
        where: {
            organizerId: user.id
        }
    });
    let joined = await User.findByPk(user.id, {
        include: {
            model: Group,
            required: true
        }
    });

    let groupList = [];
    organized.forEach((group) => {
        groupList.push(group.toJSON());
    });

    joined.Groups.forEach((group) => {
        group = group.toJSON();
        delete group.Membership;
        let obj = groupList.find(groupList => groupList.id === group.id)
        if (!obj) groupList.push(group);
    });

    let result = {
        "Groups": groupList
    }

    return res.json(result);
});

// /api/groups/:groupId GET 
//Get details of a Group from an id
router.get('/:groupId', async (req, res, next) => {
    console.log(req.params.groupId)

    let group = await Group.findByPk(+req.params.groupId, {
        include: [{
            model: GroupImage,
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        },
        {
            model: Venue
        }]
    });

    if (!group) {
        let err = new Error("Group couldn't be found");
        err.status = 404;
        err.message = "Group couldn't be found";
        return next(err);
    }

    let organizer = await group.getOrganizer();
    group = group.toJSON();
    delete group.username;
    group.Organizer = organizer;

    return res.json(group);
});

//POST, /api/groups, Creates and returns a new group
router.post('/', requireAuth, async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body;
    const { user } = req;
    //error handling
    let err = new Error("Validation Error");
    err.status = 400;
    err.message = "Validation Error"

    if (!name || name.length > 60) {
        err.errors = {
            "name": "Name must be 60 characters or less"
        }
        return next(err);
    }
    else if (!about || about.length < 50) {
        err.errors = {
            "about": "About must be 50 characters or more"
        }
        return next(err);
    }
    else if (type !== 'Online' && type !== 'In person') {
        err.errors = {
            "type": "Type must be 'Online' or 'In person'"
        }
        return next(err);
    }
    else if (private !== true && private !== false) {
        err.errors = {
            "private": "Private must be a boolean"
        }
        return next(err);
    }
    else if (!city) {
        err.errors = {
            "city": "City is required"
        }
        return next(err);
    }
    else if (!state) {
        err.errors = {
            "state": "State is required"
        }
        return next(err);
    }


    let newGroup = await Group.create({
        organizerId: user.id,
        name,
        about,
        type,
        private,
        city,
        state
    });

    return res.json(newGroup);
});

//POST, /api/groups/:groupId/images, 
//Create and return a new image for a group specified by id.
router.post('/:groupId/images', requireAuth, async (req, res, next) => {
    const { user } = req;
    let groupId = req.params.groupId;

    const { url, preview } = req.body;

    const group = await Group.findByPk(groupId);
    //error handling
    if (!group) {
        let err = new Error("Group couldn't be found");
        err.status = 404;
        err.message = "Group couldn't be found"
        return next(err);
    }
    else if (user.id !== group.organizerId) {
        let err = new Error();
        err.status = 401;
        err.message = "User is not organizer of Group";
        return next(err);
    };

    let image = await GroupImage.create({
        groupId,
        url,
        preview
    });

    image = image.toJSON();
    delete image.createdAt;
    delete image.updatedAt;

    return res.json(image);
});

//PUT, /api/groups/:groupId 
//Updates and returns an existing group.
router.put('/:groupId', requireAuth, async (req, res, next) => {
    const { name, about, type, private, city, state } = req.body;
    const { user } = req;
    const id = +req.params.groupId;

    let group = await Group.findByPk(id);

    //error handling
    if (!group) {
        let err = new Error("Group couldn't be found");
        err.status = 404;
        err.message = "Group couldn't be found"
        return next(err);
    }
    //check if user is group's organizer
    if (user.id !== group.organizerId) {
        let err = new Error("Group is not organized by user");
        err.status = 401;
        err.message = "Group is not organized by user, authorization error"
        return next(err);
    }
    //body validation
    let err = new Error("Validation Error");
    err.status = 400;
    err.message = "Validation Error";
    if (name && name.length > 60) {
        err.error = {
            "name": "Name must be 60 characters or less"
        }
        return next(err);
    }
    else if (about && about.length < 50) {
        err.error = {
            "about": "About must be 50 characters or more"
        };
        return next(err);
    }
    else if (type !== 'Online' && type !== 'In person') {
        err.error = {
            "type": "Type must be 'Online' or 'In person'"
        };
        return next(err);
    }
    else if (private !== true && private !== false) {
        err.error = {
            "private": "Private must be a boolean"
        };
        return next(err);
    }
    else if (!city) {
        err.error = {
            "city": "City is required"
        };
        return next(err);
    }
    else if (!state) {
        err.error = {
            "state": "State is required"
        };
        return next(err);
    }

    //add objects to updateObj

    const updateObj = {}
    if (name) updateObj.name = name;
    if (about) updateObj.about = about;
    if (type) updateObj.type = type;
    if (private) updateObj.private = private;
    if (city) updateObj.city = city;
    if (state) updateObj.state = state;

    await group.update(updateObj);

    return res.json(group);
});

//DELETE, /api/groups/:groupId, Deletes an existing group.
router.delete('/:groupId', requireAuth, async (req, res, next) => {
    const { user } = req;
    const groupId = req.params.groupId;

    let group = await Group.findByPk(groupId);
    if (!group) {
        let err = new Error("Group couldn't be found");
        err.status = 404;
        err.message = "Group couldn't be found"
        return next(err);
    };

    group.destroy();

    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
});

//get all venues for a group specified by its id
//GET, /api/groups/:groupId/venues
router.get('/:groupId/venues', requireAuth, async (req, res, next) => {
    const { user } = req;
    const groupId = +req.params.groupId;

    let group = await Group.findByPk(groupId, {
        include: {
            model: Venue,
            through: {
                attributes: []
            }
        },
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    });
    //error handling for group
    if (!group) {
        let err = new Error("Group couldn't be found");
        err.status = 404;
        err.message = "Group couldn't be found"
        return next(err);
    }
    else if (group.organizerId !== user.id) {
        let err = new Error("Group is not organized by user");
        err.status = 401;
        err.message = "Group is not organized by user, authorization error"
        return next(err);
    };
    const result = {
        "Venues": []
    };

    group.Venues.forEach((venue) => {
        let newVenue = venue.toJSON();
        newVenue.groupId = groupId;
        result.Venues.push(newVenue);
    });


    return res.json(result);
});

//POST /api/groups/:groupId/venues
// Creates and returns a new venue for a group specified by its id

router.post('/:groupId/venues', requireAuth, async (req, res, next) => {
    const { user } = req;
    const groupId = +req.params.groupId;
    const { address, city, state, lat, lng } = req.body;

    let group = await Group.findByPk(groupId, {
        include: {
            model: User,
            as: "GroupUsers"
        }
    });

    //error handling
    //handles if group is not found
    if (!group) {
        let err = new Error("Group couldn't be found");
        err.status = 404;
        err.message = "Group couldn't be found"
        return next(err);
    };

    //handles user authorization, Current User must be the organizer of the group 
    //or a member of the group with a status of "co-host"

    let groupUsers = await groupUser.findAll({
        where: {
            userId: user.id,
            groupId: groupId,
            status: 'co-host'
        }
    });
    if ((groupUsers.length === 0 && user.id !== group.organizerId)) {
        let err = new Error("User is not a member and a co-host.");
        err.status = 401;
        err.message = "User is not a member and a co-host. authorization error"
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

    //create a new venue
    let newVenue = await Venue.create({
        address,
        city,
        state,
        lat,
        lng
    });

    //add association between group and venue
    let association = await venueGroup.create({
        groupId: groupId,
        venueId: newVenue.id
    });

    let result = newVenue.toJSON();
    result.groupId = groupId;
    delete result.createdAt;
    delete result.updatedAt;

    return res.json(result);
});

//Get all Events of a Group specified by its id
//GET, /api/groups/:groupId/events
router.get('/:groupId/events', async (req, res, next) => {
    const groupId = +req.params.groupId;
    let group = await Event.findAll({
        where: {
            groupId: groupId
        },
        attributes: {
            exclude: ['capacity', 'price', 'createdAt', 'updatedAt', 'description']
        },
        include: [{
            model: Group,
            attributes: ['id', 'name', 'city', 'state']
        },
        {
            model: Venue,
            attributes: ['id', 'city', 'state']
        }
        ]
    });

    //error handling
    //handles if group is not found
    if (group.length === 0) {
        let err = new Error("Group couldn't be found");
        err.status = 404;
        err.message = "Group couldn't be found"
        return next(err);
    };

    return res.json(group);
});

//POST, URL: /api/groups/:groupId/events
//Create an Event for a Group specified by its id
router.post('/:groupId/events', requireAuth, async (req, res, next) => {
    const { user } = req;
    const groupId = +req.params.groupId;
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    let group = await Group.findByPk(groupId);
    let venue = await Group.findByPk(venueId);
    //error handling
    //handles if group is not found
    if (!group) {
        let err = new Error("Group couldn't be found");
        err.status = 404;
        err.message = "Group couldn't be found"
        return next(err);
    };

    //handles user authorization, Current User must be the organizer of the group 
    //or a member of the group with a status of "co-host"

    let groupUsers = await groupUser.findAll({
        where: {
            userId: user.id,
            groupId: groupId,
            status: 'co-host'
        }
    });
    if ((groupUsers.length === 0 && user.id !== group.organizerId)) {
        let err = new Error("User is not a member and a co-host.");
        err.status = 401;
        err.message = "User is not a member and a co-host. authorization error"
        return next(err);
    }


    //handles body errors and validation error 
    let bodyErr = new Error("Validation error")
    if (!venue) {
        bodyErr.status = 400;
        bodyErr.errors = {
            "address": "Venue does not exist"
        }
        return next(bodyErr);
    }
    else if (name.length < 5) {
        bodyErr.status = 400;
        bodyErr.errors = {
            "name": "Name must be at least 5 characters"
        }
        return next(bodyErr);
    }
    else if (type !== "Online" && type !== "In person") {
        bodyErr.status = 400;
        bodyErr.errors = {
            "type": "Type must be Online or In person"
        }
        return next(bodyErr);
    }
    else if (!+capacity || (+capacity && !Number.isInteger(+capacity))) {
        bodyErr.status = 400;
        bodyErr.errors = {
            "capacity": "Capacity must be an integer"
        }
        return next(bodyErr);
    }
    else if (!+price) {
        bodyErr.status = 400;
        bodyErr.errors = {
            "price": "Price is invalid"
        }
        return next(bodyErr);
    }
    else if (!description) {
        bodyErr.status = 400;
        bodyErr.errors = {
            "description": "Description is required"
        }
        return next(bodyErr);
    }
    //add startDate and endDate comparisons
    let currentDate = new Date();
    currentDate = currentDate.getTime();

    let startDates = new Date(startDate);
    let endDates = new Date(endDate);
    startDates = startDates.getTime();
    endDates = endDates.getTime();

    if (currentDate > startDates) {
        bodyErr.status = 400;
        bodyErr.errors = {
            "startDate": "Start date must be in the future"
        }
        return next(bodyErr);
    }
    else if (endDates < startDate) {
        bodyErr.status = 400;
        bodyErr.errors = {
            "endDate": "End date is less than start date"
        }
        return next(bodyErr);
    }

    //create a new venue
    let newEvent = await Event.create({
        groupId,
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
    });

    return res.json(newEvent);
});




module.exports = router;
