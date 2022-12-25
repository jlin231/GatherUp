// backend/routes/api/events.js
const express = require('express')
const router = express.Router();

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Event, Group, Venue, EventImage, Image, Attendance, Membership } = require('../../db/models');
const { Op } = require('sequelize');
const group = require('../../db/models/group');
const membership = require('../../db/models/membership');

//GET URL: /api/events, Returns all the events.
router.get('/', async (req, res, next) => {
    let events = await Event.findAll({
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

//GET URL: /api/events/:eventId, Returns the details of an event specified by its id.
router.get('/:eventId', async (req, res, next) => {
    const eventId = +req.params.eventId;
    console.log('test')
    let events = await Event.findByPk(eventId, {
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        include: [{
            model: Group,
            attributes: ['id', 'name', 'city', 'state', 'private']
        },
        {
            model: Venue,
            attributes: {
                exclude: ['groupId', 'createdAt', 'updatedAt']
            }

        },
        {
            model: EventImage,
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'eventId']
            }
        }
        ]
    });
    //error handling
    //handles if group is not found
    if (!events) {
        let err = new Error("Event couldn't be found");
        err.status = 404;
        err.message = "Event couldn't be found"
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

    events = events.toJSON();
    //add preview images and urls to group output
    events.numAttending = attendeeNumber[events.id];
    if (!attendeeNumber[events.id]) {
        events.numAttending = 0;
    };

    return res.json(events);
});

//POST, URL: /api/events/:eventId/images
//Create and return a new image for an event specified by id.
//authorization: Current User must be an attendee, host, or co-host of the event
router.post('/:eventId/images', requireAuth, async (req, res, next) => {
    const eventId = +req.params.eventId;
    const { user } = req;
    const { url, preview } = req.body;

    //check if event is found
    let event = await Event.findByPk(eventId);

    if (!event) {
        let bodyErr = new Error("Event couldn't be found")
        bodyErr.status = 404;
        bodyErr.message = "Event couldn't be found";
        return next(bodyErr);
    }

    //check if current user is attendee of event, host/organizer or co-host of event
    //check current attendance of user
    let attendeeCheck = await Attendance.findAll({
        where: {
            eventId,
            userId: user.id,
            status: 'member'
        }
    });
    //find membership, and co-host status of group
    let memberShipCheck = await Attendance.findAll({
        where: {
            eventId: event.groupId,
            userId: user.id,
            status: 'co-host'
        }
    });

    //find group of event
    let group = await Group.findByPk(event.groupId);

    if (user.id !== group.organizerId && attendeeCheck.length === 0 && memberShipCheck.length === 0) {
        let err = new Error("Authorization Error, user is not organizer, attendee, or co-host of group.")
        err.status = 401;
        err.message = "Authorization Error, user is not organizer, attendee, or co-host of group.";
        return next(err);
    };

    //create a new image
    let newImage = await EventImage.create({ eventId, url, preview });

    //process result 
    newImage = newImage.toJSON();
    delete newImage.createdAt;
    delete newImage.updatedAt;
    return res.json(newImage);
});

//PUT /api/events/:eventId
//Edit and returns an event specified by its id
router.put('/:eventId', requireAuth, async (req, res, next) => {
    let eventId = +req.params.eventId;
    const { user } = req;
    //check if event is found
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    let event = await Event.findByPk(eventId);
    if (!event) {
        let bodyErr = new Error("Event couldn't be found")
        bodyErr.status = 404;
        bodyErr.message = "Event couldn't be found";
        return next(bodyErr);
    }

    let venue = await Venue.findByPk(venueId);
    if (!venue) {
        let bodyErr = new Error("Venue couldn't be found")
        bodyErr.status = 404;
        bodyErr.message = "Venue couldn't be found";
        return next(bodyErr);
    }

    //handles user authorization, Current User must be the organizer of the group 
    //or a member of the group with a status of "co-host"
    let members = await Membership.findAll({
        where: {
            userId: user.id,
            groupId: event.groupId,
            status: 'co-host'
        }
    });

    let group = await Group.findByPk(event.groupId)

    if ((members.length === 0 && user.id !== group.organizerId)) {
        let err = new Error("User is not a member or a co-host.");
        err.status = 401;
        err.message = "User is not a member or a co-host. authorization error"
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

    event.update({
        groupId: venue.groupId,
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
    });

    const result = event.toJSON();
    delete result.createdAt;
    delete result.updatedAt;

    return res.json(result);
});

// GET /api/events/:eventId/attendees
// Returns the attendees of an event specified by its id.
router.get('/:eventId/attendees', async (req, res, next) => {
    let eventId = +req.params.eventId;
    const { user } = req;

    let event = await Event.findByPk(eventId, {
        include: {
            model: User
        }
    });

    if (!event) {
        let bodyErr = new Error("Event couldn't be found")
        bodyErr.status = 404;
        bodyErr.message = "Event couldn't be found";
        return next(bodyErr);
    }

    //find group associated with event to find organizer
    let group = await Group.findByPk(event.groupId);

    let userMembership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: event.groupId,
            status: 'co-host'
        }
    });
    let attendees = []
    event.Users.forEach((user) => {
        user = user.toJSON();
        delete user.username;
        delete user.Attendance.eventId
        delete user.Attendance.userId
        delete user.Attendance.createdAt
        delete user.Attendance.updatedAt
        attendees.push(user);
    })
    // return all attendees if user is a co-host member or an organizer of group
    if (userMembership || user.id === group.organizerId) {
        let result = {
            Attendees: attendees
        }
        return res.json(result);
    }
    console.log('test')
    //remove pending, because user is not a co-host or an organizer of group
    for (let i = 0; i < attendees.length; i++) {
        if (attendees[i].Attendance.status === 'pending') {
            attendees.splice(i, 1);
        }
    };

    return res.json({ Attendees: attendees });

});

// POST /api/events/:eventId/attendance
// Returns the attendees of an event specified by its id.
router.post('/:eventId/attendance', requireAuth, async (req, res, next) => {
    let eventId = +req.params.eventId;
    const { user } = req;

    let event = await Event.findByPk(eventId);
    if (!event) {
        let bodyErr = new Error("Event couldn't be found");
        bodyErr.status = 404;
        bodyErr.message = "Event couldn't be found";
        return next(bodyErr);
    }

    //check membership of current user
    let memberShip = await Membership.findAll({
        where: {
            groupId: event.groupId,
            userId: user.id
        }
    });
    console.log("groupId: ", event.groupId);
    console.log("currentUser: ", user.id)
    console.log(memberShip)
    //user is not member of the event group
    if (memberShip.length === 0) {
        let err = new Error("Authorization Error")
        err.status = 403;
        err.message = "Forbidden";
        return next(err);
    };

    //check if current Attendance between requested user and event exists
    let attendance = await Attendance.findOne({
        where: {
            eventId,
            userId: user.id
        }
    });
    //no attendance is found, new attendance can be created
    if (!attendance) {
        let newAttendance = await Attendance.create({
            userId: user.id,
            eventId,
            status: 'pending'
        });
        let result = newAttendance.toJSON();
        delete result.createdAt;
        delete result.updatedAt;
        delete result.eventId;
        return res.json(result);
    }
    else if(attendance.status === 'pending' || attendance.status === 'waitlist'){
        let err = new Error("Attendance has already been requested")
        err.status = 400;
        err.message = "Attendance has already been requested";
        return next(err);
    }
    else if(attendance.status === 'attending'){
        let err = new Error("User is already an attendee of the event")
        err.status = 400;
        err.message = "User is already an attendee of the event";
        return next(err);
    }

});

// PUT, /api/events/:eventId/attendance
// Change the status of an attendance for an event specified by id.
router.put('/:eventId/attendance', requireAuth, async(req, res, next)=>{
    let eventId = +req.params.eventId;
    const { userId, status } = req.body;
    const { user } = req;   

    if(status === 'pending'){
        let bodyErr = new Error("Cannot change an attendance status to pending");
        bodyErr.status = 400;
        bodyErr.message = "Cannot change an attendance status to pending";
        return next(bodyErr);
    };

    let event = await Event.findByPk(eventId);
    if (!event) {
        let bodyErr = new Error("Event couldn't be found");
        bodyErr.status = 404;
        bodyErr.message = "Event couldn't be found";
        return next(bodyErr);
    }
    //check co-host membership/organization status of current user
    let members = await Membership.findAll({
        where: {
            userId: user.id,
            groupId: event.groupId,
            status: 'co-host'
        }
    });

    let group = await Group.findByPk(event.groupId)

    if ((members.length === 0 && user.id !== group.organizerId)) {
        let err = new Error("Authorization Error")
        err.status = 403;
        err.message = "Forbidden";
        return next(err);
    }

    let attendance = await Attendance.findOne({
        where: {
            eventId,
            userId 
        },
        attributes: {
            include: ['id']
        }
    });

    if(!attendance){
        let bodyErr = new Error("Attendance between the user and the event does not exist");
        bodyErr.status = 404;
        bodyErr.message = "Attendance between the user and the event does not exist";
        return next(bodyErr);
    }
    attendance.update({
        status
    });

    let result = attendance.toJSON();
    delete result.createdAt;
    delete result.updatedAt;

    return res.json(result);
});

module.exports = router;
