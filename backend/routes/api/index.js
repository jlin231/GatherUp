// backend/routes/api/index.js
const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const groupsRouter = require('./groups.js');
const venuesRouter = require('./venues.js');
const eventsRouter = require('./events.js');
const { restoreUser, requireAuth } = require("../../utils/auth.js");
const { GroupImage, Group, Membership, EventImage, Event } = require('../../db/models');

// Connect restoreUser middleware to the API router
// If current user session is valid, set req.user to the user in the database
// If current user session is not valid, set req.user to null
router.use(restoreUser);


// router.post('/test', (req, res) => {
//   res.json({ requestBody: req.body });
// });

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/groups', groupsRouter);

router.use('/venues', venuesRouter);

router.use('/events', eventsRouter);

//DELETE Delete an Image for a Group
// /api/group-images/:imageId
//proper authorization: Current User must be the host of the group, or the user whose membership is being deleted
router.delete('/group-images/:imageId', requireAuth, async (req, res, next) => {
  let imageId = +req.params.imageId;
  const { user } = req;

  let image = await GroupImage.findByPk(imageId);
  if (!image) {
    let err = new Error("Group Image couldn't be found")
    err.status = 404;
    err.message = "Group Image couldn't be found";
    return next(err);
  }

  let thisGroup = await Group.findByPk(image.groupId);

  //check if current user is co-host of current group or organizer of group
  let coHostStatus = await Membership.findAll({
    where: {
      groupId: thisGroup.id,
      userId: user.id,
      status: "co-host"
    }
  });

  if (coHostStatus.length === 0 && thisGroup.organizerId !== user.id) {
    let err = new Error("Forbidden");
    err.status = 403;
    err.statusCode = 403;
    err.message = "Forbidden";
    return next(err);
  };

  //delete membershipCheck
  await GroupImage.destroy({
    where: {
      id: imageId
    }
  });

  return res.json({
    "message": "Successfully deleted",
    "statusCode": 200
  });

});

//DELETE Delete an Image for a Event
// /api/event-images/:imageId
//proper authorization: Current user must be the organizer or "co-host" of the Group that the Event belongs to
router.delete('/event-images/:imageId', requireAuth, async (req, res, next) => {
  let imageId = +req.params.imageId;
  const { user } = req;

  let image = await EventImage.findByPk(imageId);
  if (!image) {
    let err = new Error("Event Image couldn't be found")
    err.status = 404;
    err.message = "Event Image couldn't be found";
    return next(err);
  }

  let event = await Event.findByPk(image.eventId);
  let group = await Group.findByPk(event.groupId);
  //check if current user is co-host of current group or organizer of group
  let coHostStatus = await Membership.findAll({
    where: {
      groupId: group.id,
      userId: user.id,
      status: "co-host"
    }
  });

  if (coHostStatus.length === 0 && group.organizerId !== user.id) {
    let err = new Error("Forbidden");
    err.status = 403;
    err.statusCode = 403;
    err.message = "Forbidden";
    return next(err);
  };

  //delete membershipCheck
  await EventImage.destroy({
    where: {
      id: imageId
    }
  });

  return res.json({
    "message": "Successfully deleted",
    "statusCode": 200
  });

});


// //test for requireAuth
// router.post('/test',  (req, res) => {
//   res.json({ message: "success" });
// });


// // GET /api/set-token-cookie
// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');
// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: 'Demo-lition'
//     }
//   });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });

// //tests 
// router.get(
//   '/require-auth',
//   requireAuth,
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

module.exports = router;
