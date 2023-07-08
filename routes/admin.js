const express = require('express');
const isAuth = require('../middlewares/auth');
const adminControllers = require('../controllers/admin');
const { body } = require('express-validator');

const router = express.Router();

router.post('/addGuest', [
    body('name').isLength({min: 5}).isString().notEmpty().withMessage('invalid name'),
    body('phoneNo').isLength({min: 13, max: 13}).isString().notEmpty().withMessage('invalid phone number')
    ], isAuth, adminControllers.addAGuest);

router.get('/getAllGuests', isAuth, adminControllers.getAllGuests);

router.post('/adminConfirmGuestPresence/:id', isAuth, adminControllers.confirmGuestPresence);
module.exports = router;