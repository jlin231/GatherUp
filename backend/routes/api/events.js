// backend/routes/api/events.js
const express = require('express')
const router = express.Router();

const {setTokenCookie, restoreUser, requireAuth} = require('../../utils/auth');
const {User, Event, Group, Venue, eventImage, Image,eventAttendee, groupUser} = require('../../db/models');
const {Op} = require('sequelize');

//GET URL: /api/events, Returns all the events.
router.get('/', async (req, res, next)=>{
    let events = await Event.findAll({
        attributes:{
            exclude: ['capacity', 'price', 'createdAt', 'updatedAt','description']
        },
        include:[{
            model: Group,
            attributes: ['id', 'name', 'city', 'state']
        },
        {
            model: Venue,
            attributes: ['id', 'city', 'state']
        }
    ]
    });
    let eventList = [];
    events.forEach((event)=>{
        eventList.push(event.toJSON());
    })
    let result = {
        "Events": eventList
    }
    return res.json(result);
});

//GET URL: /api/events/:eventId, Returns the details of an event specified by its id.
router.get('/:eventId', async(req, res, next)=>{
    let eventId = +req.params.eventId;

    let event = await Event.findByPk(eventId, {
        attributes:{
            exclude: ['createdAt', 'updatedAt']
        },
        include:[{
            model: Group,
            attributes: ['id', 'name', 'city', 'state']
        },
        {
            model: Venue,
            attributes: ['id', 'city', 'state']
        },
        {
            model: Image,
            attributes: ['id', 'url', 'preview'],
            as: "EventImages",
            through: {
                attributes: []
            }
        }
    ]
    });

    if(!event){
        let err = new Error("Event couldn't be found");
        err.status = 404;
        err.message = "Event couldn't be found"
        return next(err);
    }
    
    return res.json(event);
});

//POST, URL: /api/events/:eventId/images
//Create and return a new image for an event specified by id.
router.post('/:eventId/images',requireAuth, async(req, res, next)=>{
    const eventId = +req.params.eventId;
    const {user} = req; 
    const {url, preview} = req.body;

    //check if event is found
    let event = await Event.findByPk(eventId);

    if(!event){
        let bodyErr =  new Error("Event couldn't be found")
        bodyErr.status = 404;
        bodyErr.message = "Event couldn't be found"; 
        return next(bodyErr);
    }

    //check if current user is attendee, host/organizer or co-host of event
    let result = await eventAttendee.findAll({
        where:{
            eventId,
            userId: user.id,
            status: 'member'
        }
    });

    if(result.length === 0){
        let err =  new Error("Authorization Error, user is not attendee of event")
        err.status = 401;
        err.message = "Authorization Error, user is not attendee of event"; 
        return next(err);
    };
    
    //create a new image
    let newImage = await Image.create({url, preview});

    await eventImage.create({
        eventId,
        imageId: newImage.id,
    });
    //process result 
    newImage = newImage.toJSON();
    delete newImage.createdAt;
    delete newImage.updatedAt;
    return res.json(newImage);
});

//PUT /api/events/:eventId
//Edit and returns an event specified by its id
router.put('/:eventId', requireAuth, async(req, res, next)=>{
    let eventId = +req.params.eventId;
    const {user} = req;
    //check if event is found
    const {venueId, name, type, capacity, price, description, startDate, endDate} = req.body;
    
    let event = await Event.findByPk(eventId);
    if(!event){
        let bodyErr =  new Error("Event couldn't be found")
        bodyErr.status = 404;
        bodyErr.message = "Event couldn't be found"; 
        return next(bodyErr);
    }

    let venue = await Venue.findByPk(venueId);
    if(!venue){
        let bodyErr =  new Error("Venue couldn't be found")
        bodyErr.status = 404;
        bodyErr.message = "Venue couldn't be found"; 
        return next(bodyErr);
    }

    //handles user authorization, Current User must be the organizer of the group 
    //or a member of the group with a status of "co-host"
    console.log("test")
    let groupUsers = await groupUser.findAll({
        where: {
            userId: user.id,
            groupId: event.groupId,
            status: 'co-host'
        }
    });

    let group = await Group.findByPk(venue.groupId)

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
    else if (type !== "Online" && type!== "In person") {
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
            "price":"Price is invalid"
        }
        return next(bodyErr);
    }
    else if(!description){
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

    if(currentDate > startDates){
        bodyErr.status = 400;
        bodyErr.errors = {
            "startDate": "Start date must be in the future"
        }
        return next(bodyErr);
    }
    else if(endDates < startDate){
        bodyErr.status = 400;
        bodyErr.errors = {
            "endDate": "End date is less than start date"
        }
        return next(bodyErr);
    }

    let newEvent = await Event.create({
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

    return res.json(newEvent);
});


module.exports = router;
