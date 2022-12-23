// backend/routes/api/events.js
const express = require('express')
const router = express.Router();

const {setTokenCookie, restoreUser, requireAuth} = require('../../utils/auth');
const {User, Event, Group, Venue, eventImage, Image,eventAttendee} = require('../../db/models');
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

module.exports = router;
