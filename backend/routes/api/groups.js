// backend/routes/api/session.js
const express = require('express')
const router = express.Router();

const { Group, User, Image, Venue, groupImage, groupUser, venueGroup, Event } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');


// /api/groups GET Returns all the groups.
router.get('/', async (req, res, next) => {
    let groups = await Group.findAll();

    const groupList = [];
    groups.forEach((group) => {
        groupList.push(group.toJSON())
    })
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
            as: "usersBelongToGroups",
            required: true
        }
    });

    let groupList = [];
    organized.forEach((group) => {
        groupList.push(group.toJSON());
    });

    joined.usersBelongToGroups.forEach((group) => {
        group = group.toJSON();
        delete group.groupUser;
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
            model: Image,
            as: "GroupImages",
            through: {
                attributes: []
            }
        },
        {
            model: Venue,
            through: {
                attributes: []
            }
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

    let image = await Image.create({
        url,
        preview
    });

    await groupImage.create({
        groupId: groupId,
        imageId: image.id
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
    const id = req.params.groupId;

    let group = await Group.findByPk(id, {
        attributes: {
            include: ["id", "organizerId", "name", "about", "type",
                "private", "state", "createdAt", "updatedAt"],
            exclude: ["numMembers", "previewImage"]
        }
    });

    //error handling
    if (!group) {
        let err = new Error("Group couldn't be found");
        err.status = 404;
        err.message = "Group couldn't be found"
        return next(err);
    }
    //check if user is group's organizer
    if (user.id === group.organizerId) {
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
router.post('/:groupId/events', async(req, res, next)=>{
    
});

module.exports = router;
