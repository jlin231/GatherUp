// backend/routes/api/users.js
const express = require('express');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// /api/users, Sign up a user
router.post('/', validateSignup, async (req, res, next) => {
  let { firstName, lastName, email, password, username } = req.body;
  if (!username) {
    username = null
  }

  //look through users see if something is found by email
  let oldUser = await User.scope('currentUser').findOne({
    where: {
      email
    }
  });
  //body validation
  let err = new Error("Validation Error");
  if (!email) {
    err.status = 400;
    err.errors = {
      "email": "Invalid email"
    }
    return next(err);
  }
  else if (!firstName) {
    err.status = 400;
    err.errors = {
      "firstName": "First Name is required"
    }
    return next(err);
  }
  else if (!lastName) {
    err.status = 400;
    err.errors = {
      "lastName": "Last Name is required"
    }
    return next(err);
  }



  if (oldUser) {
    const err = new Error("User already exists");
    err.message = "User already exists";
    err.status = 403;
    err.errors = ["User with that email already exists"];
    return next(err);
  };

  const user = await User.signup({ firstName, lastName, email, username, password });
  await setTokenCookie(res, user);
  let userResult = user.toJSON();
  userResult.token = "";
  delete userResult.createdAt;
  delete userResult.updatedAt;
  delete userResult.username;
  return res.json({
    user: userResult
  });
});

module.exports = router;
