// backend/routes/api/session.js
const express = require('express')
const router = express.Router();

const {setTokenCookie, restoreUser} = require('../../utils/auth');
const {User} = require('../../db/models');


// /api/session Logs in a user already added to the database
router.post('/', async (req, res, next)=>{
    const { credential, password } = req.body;

    const user = await User.login({ credential, password });

    if (!user) {
      const err = new Error('Login failed');
      err.status = 401;
      err.title = 'Login failed';
      err.errors = ['The provided credentials were invalid.'];
      return next(err);
    }

    await setTokenCookie(res, user);

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

