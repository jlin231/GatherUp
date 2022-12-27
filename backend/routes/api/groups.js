// backend/routes/api/session.js
const express = require('express')
const router = express.Router();

const { Group, User, Attendance, GroupImage, Venue, Membership, Event, EventImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { Op } = require('sequelize');
const group = require('../../db/models/group');

// /api/groups GET Returns all the groups
router.get('/', async (req, res, next) => {
    console.log('test')
    let groups = await Group.findAll();
    const groupList = [];
    groups.forEach((group) => {
        groupList.push(group.toJSON())
    });
    //find attendees, WRONG FIND MEMBERS NOT ATTENDEES
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
        let err = new Error("Forbidden");
        err.status = 403;
        err.statusCode = 403;
        err.message = "Forbidden";
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
        let err = new Error("Forbidden");
        err.status = 403;
        err.statusCode = 403;
        err.message = "Forbidden";
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
//Only the owner of the group is authorized to delete
router.delete('/:groupId', requireAuth, async (req, res, next) => {
    const groupId = +req.params.groupId;
    const { user } = req;
    let groups = await Group.findByPk(groupId);

    if (!groups) {
        let err = new Error("Forbidden");
        err.status = 403;
        err.statusCode = 403;
        err.message = "Forbidden";
        return next(err);

    };
    if (user.id !== groups.organizerId) {
        let err = new Error("Forbidden");
        err.status = 403;
        err.statusCode = 403;
        err.message = "Forbidden";
        return next(err);
    };

    await Group.destroy({
        where: {
            id: groupId
        }
    });

    return res.json({
        "message": "Successfully deleted",
        "statusCode": 200
    });
});

//get all venues for a group specified by its id
//GET, /api/groups/:groupId/venues
router.get('/:groupId/venues', requireAuth, async (req, res, next) => {
    const { user } = req;
    const groupId = +req.params.groupId;

    let group = await Group.findByPk(groupId, {
        include: {
            model: Venue
        }
    });
    //error handling for group
    //check if the user was a member with status of co-host
    const userStatus = await Membership.findAll({
        where: {
            groupId,
            userId: user.id,
            status: "co-host"
        }
    })
    if (!group) {
        let err = new Error("Group couldn't be found");
        err.status = 404;
        err.message = "Group couldn't be found"
        return next(err);
    }
    else if ((group.organizerId !== user.id && userStatus.length === 0)) {
        let err = new Error("Forbidden");
        err.status = 403;
        err.statusCode = 403;
        err.message = "Forbidden";
        return next(err);
    };

    const result = {
        "Venues": []
    };

    group.Venues.forEach((venue) => {
        let newVenue = venue.toJSON();
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
            model: Venue
        }
    });
    //error handling for group
    //check if the user was a member with status of co-host
    const userStatus = await Membership.findAll({
        where: {
            groupId,
            userId: user.id,
            status: "co-host"
        }
    });
    if (!group) {
        let err = new Error("Group couldn't be found");
        err.status = 404;
        err.message = "Group couldn't be found"
        return next(err);
    }
    if ((group.organizerId !== user.id && userStatus.length === 0)) {
        let err = new Error("Forbidden");
        err.status = 403;
        err.statusCode = 403;
        err.message = "Forbidden";
        return next(err);
    };

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

    //create a new venue
    let newVenue = await Venue.create({
        groupId,
        address,
        city,
        state,
        lat,
        lng
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
    let events = await Event.findAll({
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
    if (events.length === 0) {
        let err = new Error("Group couldn't be found");
        err.status = 404;
        err.message = "Group couldn't be found"
        return next(err);
    };

    //find numAttending
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
    const images = await EventImage.findAll();
    let previewImages = {}
    images.forEach((image) => {
        image = image.toJSON();
        if (image.preview === true) {
            previewImages[image.eventId] = image.url;
        }
    });

    let eventList = [];
    events.forEach((event) => {
        eventList.push(event.toJSON());
    })
    //add preview images and urls to group output
    for (let i = 0; i < eventList.length; i++) {
        eventList[i].previewImage = previewImages[eventList[i].id];
        eventList[i].numAttending = attendeeNumber[eventList[i].id];
        if (!attendeeNumber[eventList[i].id]) {
            eventList[i].numAttending = 0;
        }
    }

    let result = {
        "Events": eventList
    }
    return res.json(result);
});

//POST, URL: /api/groups/:groupId/events, NOT DONE
//Create an Event for a Group specified by its id
router.post('/:groupId/events', requireAuth, async (req, res, next) => {
    const { user } = req;
    const groupId = +req.params.groupId;
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    let group = await Group.findByPk(groupId);
    let venue = await Venue.findByPk(venueId);
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

    let groupUsers = await Membership.findAll({
        where: {
            userId: user.id,
            groupId: groupId,
            status: 'co-host'
        }
    });
    if ((groupUsers.length === 0 && user.id !== group.organizerId)) {
        let err = new Error("Forbidden");
        err.status = 403;
        err.statusCode = 403;
        err.message = "Forbidden";
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
    else if (endDates < startDates) {
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

//GET, /api/groups/:groupId/members
// Get all Members of a Group specified by its id
router.get('/:groupId/members', async (req, res, next) => {
    const groupId = +req.params.groupId;
    const { user } = req;

    let groupInfo = await Group.findByPk(groupId, {
        include: {
            model: User,
            through: {
                attributes: {
                    exclude: ['username']
                }
            }
        }
    });

    if (!groupInfo) {
        let err = new Error("Group couldn't be found");
        err.status = 404;
        err.message = "Group couldn't be found"
        return next(err);
    }

    //extract user information from members array and put into users array
    let users = [];
    groupInfo.Users.forEach((user) => {
        user = user.toJSON();
        users.push(user);
    });

    //process users object for presentation
    users.forEach((user) => {
        delete user.username;
        delete user.Membership.userId;
        delete user.Membership.groupId;
        delete user.Membership.createdAt;
        delete user.Membership.updatedAt;
    })

    //check if current user is organizer of group or co-host member of group
    let membership = await Membership.findAll({
        where: {
            userId: user.id,
            groupId: groupId,
            status: 'co-host'
        }
    });
    //case where user is not organizer or co-host member of group
    if (user.id !== groupInfo.organizerId && membership.length === 0) {
        for (let i = 0; i < users.length; i++) {
            if (users[i].Membership.status === "pending") {
                users.splice(i, 1);
            }
        }
        return res.json(users);
    }

    return res.json(users);
});

//POST URL: /api/groups/:groupId/membership
//Request a new membership for a group specified by id.
router.post('/:groupId/membership', requireAuth, async (req, res, next) => {
    const groupId = +req.params.groupId;
    const { user } = req;

    const groupInfo = await Group.findByPk(groupId);
    //handles group not found
    if (!groupInfo) {
        let err = new Error("Group couldn't be found");
        err.status = 404;
        err.statusCode = 404;
        err.message = "Group couldn't be found"
        return next(err);
    }

    const currentMembership = await Membership.findOne({
        where: {
            groupId,
            userId: user.id
        }
    });
    //no membership found, membership is requested
    if (!currentMembership) {
        const newMember = await Membership.create({
            userId: user.id,
            groupId,
            status: "pending"
        });
        return res.json({
            "memberId": newMember.userId,
            "status": "pending"
        })
    }
    //current user already has pending membership
    else if (currentMembership.status === 'pending') {
        let err = new Error("Membership has already been requested");
        err.status = 400;
        err.message = "Membership has already been requested"
        return next(err);
    }
    //current user already has membership
    else if (currentMembership.status === 'member' || currentMembership.status === 'co-host') {
        let err = new Error("User is already a member of the group");
        err.status = 400;
        err.message = "User is already a member of the group"
        return next(err);
    }
    return res.json();

});

//PUT URL: /api/groups/:groupId/membership
//Change the status of a membership for a group specified by id.
router.put('/:groupId/membership', requireAuth, async (req, res, next) => {
    const groupId = +req.params.groupId;
    const { user } = req;
    const { memberId, status } = req.body;
    //check if membership status to change to is pending
    if (status === 'pending') {
        let err = new Error("Validations Error");
        err.status = 400;
        err.message = "Validations Error"
        err.errors = {
            "status": "Cannot change a membership status to pending"
        };
        return next(err);
    }

    //check group status
    let groupInfo = await Group.findByPk(groupId);
    if (!groupInfo) {
        let err = new Error("Group couldn't be found");
        err.status = 404;
        err.message = "Group couldn't be found"
        return next(err);
    };

    //get current status of user in the group

    let currentMember = await Membership.findOne({
        where: {
            userId: memberId,
            groupId
        },
        attributes: {
            include: ['id']
        }
    });
    console.log(currentMember)
    //if membership doesn't exist between user and group
    if (!currentMember) {
        let err = new Error("Membership between the user and the group does not exits");
        err.status = 404;
        err.message = "Membership between the user and the group does not exits"
        return next(err);
    }

    const membershipStatus = currentMember.status;
    //see if user is a organizer, or member of the group with co-host status
    console.log(membershipStatus)
    const userStatus = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: groupId,
            status: "co-host"
        }
    });

    // console.log(user.id)
    // console.log(groupInfo.organizerId)
    // console.log(userStatus)
    // console.log(membershipStatus)

    if (membershipStatus === 'pending' && status === "member") {
        if ((user.id === groupInfo.organizerId || userStatus)) {
            //body asks to turn pending to member, and user is an organizer or co-host of group
            currentMember.update({
                status: "member"
            });
            return res.json({
                id: currentMember.id,
                groupId,
                memberId,
                status: "member"
            })
        }
    }
    else if (membershipStatus === 'member' && status === 'co-host') {
        if ((user.id === groupInfo.organizerId)) {
            //body asks to turn member to co-host, and user is an co-host of group
            currentMember.update({
                status: "co-host"
            });
            return res.json({
                id: currentMember.id,
                groupId,
                memberId,
                status: "co-host"
            })
        }
    }

    // authorization is not enough
    let err = new Error("User does not have the correct authorization or status desired invalid");
    err.status = 401;
    err.message = "User does not have the correct authorization or status desired invalid."
    return next(err);
});

//DELETE delete membership to a group specified by id
//  /api/groups/:groupId/membership
//proper authorization: Current User must be the host of the group, or the user whose membership is being deleted
router.delete('/:groupId/membership', requireAuth, async (req, res, next) => {
    let groupId = +req.params.groupId;
    const { memberId } = req.body;
    const { user } = req;
    //check if current user is co-host of current group or organizer of group
    let coHostStatus = await Membership.findAll({
        where: {
            groupId,
            userId: user.id,
            status: "co-host"
        }
    });
    let group = await Group.findByPk(groupId);
    if (!group) {
        let err = new Error("Group couldn't be found");
        err.status = 404;
        err.statusCode = 404;
        err.message = "Group couldn't be found";
        return next(err);
    }

    let userCheck = await User.findByPk(memberId);
    if (!userCheck) {
        let err = new Error("Validation Error");
        err.status = 400;
        err.statusCode = 400;
        err.message = "Validation Error";
        err.errors = { "memberId": "User couldn't be found" }
        return next(err);
    }
    console.log(coHostStatus)
    if (coHostStatus.length === 0 && user.id !== memberId && group.organizerId !== user.id) {
        let err = new Error("Forbidden");
        err.status = 403;
        err.statusCode = 403;
        err.message = "Forbidden";
        return next(err);
    };

    let membershipCheck = await Membership.findOne({
        where: {
            groupId,
            userId: memberId
        }
    });
    if (!membershipCheck) {
        let err = new Error("Membership does not exist for this User");
        err.status = 404;
        err.statusCode = 404;
        err.message = "Membership does not exist for this User";
        return next(err);
    };

    //delete membershipCheck
    await Membership.destroy({
        where: {
            groupId,
            userId: memberId
        }
    });

    return res.json({
        "message": "Successfully deleted membership from group"
    });

});



module.exports = router;
