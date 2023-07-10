const express = require('express');
const guestControllers = require('../controllers/guest');

const router = express.Router();

router.get('/guestInfo/:id', guestControllers.pullGuestInfo);

router.post('/confirmPresence/:id', guestControllers.confirmPresence);

router.post('/declinePresence/:id', guestControllers.declinePresence);

module.exports = router;