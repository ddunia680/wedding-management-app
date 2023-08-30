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

router.get('/getOrdinaryGuests', isAuth, adminControllers.getOrdinaryGuests);

router.get('/getVipGuests', isAuth, adminControllers.getVipGuests);

router.get('/getVvipGuests', isAuth, adminControllers.getVvipGuests);

router.get('/getPendingInviteGuests', isAuth, adminControllers.getPendingInviteGuests);

router.get('/getConfirmedInviteGuests', isAuth, adminControllers.getConfirmedInviteGuests);

router.get('/getDeclinedInviteGuests', isAuth, adminControllers.getDeclinedInviteGuests);

router.post('/adminConfirmGuestPresence', isAuth, adminControllers.confirmGuestPresence);

router.post('/excludeGuest', isAuth, adminControllers.excludeGuest);

router.get('/checkQRStatus', isAuth, adminControllers.checkQRStatus);

router.post('/sendQRMessages', isAuth, adminControllers.sendQRMessages);

router.post('/scanQRCode', isAuth, adminControllers.scanQRCode);

router.post('/allowGuestIn', isAuth, adminControllers.allowGuestIn);

module.exports = router;