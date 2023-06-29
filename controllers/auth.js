const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.signIn = async (req, res) => {
    console.log('was hit');
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()) {
        return res.status(422).json({
            message: errors.array()[0].msg
        })
    }

    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await Admin.findOne({email: email});

        if(!user) {
            return res.status(500).json({
                message: 'wrong email address'
            })
        }

        const isEqual = await bcrypt.compare(password, user.password);
        // if()
    } catch(err) {

    }
    
}