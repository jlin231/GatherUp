// backend/routes/api/events.js
const express = require('express')
const router = express.Router();

const {setTokenCookie, restoreUser, requireAuth} = require('../../utils/auth');
const {User, Event, Group, Venue, eventImage, Image} = require('../../db/models');


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



module.exports = router;
