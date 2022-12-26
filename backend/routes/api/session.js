// backend/routes/api/session.js
const express = require('express')
const router = express.Router();

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');


// /api/session Logs in a user already added to the database
router.post('/', async (req, res, next) => {
  const { credential, password } = req.body;

  if (!credential) {
    const err = new Error('Validation error');
    err.status = 400;
    err.errors = {
      "email": "Email is required"
    };
    return next(err);
  }
  else if (!password) {
    const err = new Error('Validation error');
    err.status = 400;
    err.errors = {
      "password": "Password is required"
    };
    return next(err);
  }

  const user = await User.login({ credential, password });

  if (!user) {
    const err = new Error('Login failed');
    err.status = 401;
    err.message = "Invalid credentials"
    err.errors = ['The provided credentials were invalid.'];
    return next(err);
  }

  await setTokenCookie(res, user);
  console.log(user)
  return res.json({
    user: user
  });
});
//deletes token from cookies, means no user is present
router.delete(
  '/',
  (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);

// Restore session user
router.get(
  '/',
  restoreUser,
  (req, res) => {
    const { user } = req;
    if (user) {
      return res.json({
        user: user.toSafeObject()
      });
    } else return res.json({ user: null });
  }
);


module.exports = router;
