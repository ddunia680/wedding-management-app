const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth');

const router = express.Router();

router.put('signin', [
    body('email').isEmail().withMessage('invalid email').normalizeEmail(),
    body('password').trim().isLength({min: 5}).withMessage('wrong password')
], authController.signIn);

module.exports = router;