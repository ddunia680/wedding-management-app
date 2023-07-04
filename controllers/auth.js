const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.signIn = async (req, res) => {
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
        if(!isEqual) {
            return res.status(500).json({
                message: 'wrong password'
            })
        }
        const token = await jwt.sign(
            {
                userId: user._id,
                email: email
            }, 'someveryveryveryhash', { expiresIn: '1h' }
        )
        if(!token) {
            return res.status(500).json({
                message: 'failed'
            })
        }
        res.status(200).json({
            message: 'success',
            token: token,
            email: email
        })
    } catch(err) {
        return res.status(500).json({
            message: 'something went wrong server-side'
        })
    }
    
}