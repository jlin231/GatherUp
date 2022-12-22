// backend/routes/api/session.js
const express = require('express')
const router = express.Router();

const { Group, User, Image, Venue, groupImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.get('/', (req, res, next)=>{
    return res.json();
});


module.exports = router;
