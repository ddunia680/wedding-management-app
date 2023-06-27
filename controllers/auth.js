const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
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

    const user = await Admin.findOne({email: email});
    console.log(user);
    if(!user) {
        return res.status(500).json({
            message: 'No user found'
        })
    }

    // const isEqual = await bcrypt.compare(password, )
}