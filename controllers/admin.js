const { validationResult } = require('express-validator');
const { storeAPic } = require('../utilities/firebase.operations');
const { sendInvitationMessage } = require('../utilities/twilio.operations');
require('dotenv').config();
const Guest = require('../models/guest');

exports.addAGuest = async (req, res) => {
    console.log('reached');
    const errors = validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()) {
        return res.status(422).json({
            message: errors.array()[0].msg
        })
    }

    const profileFile = req.files[0];
    const name = req.body.name;
    const number = req.body.phoneNo;
    const quality = req.body.quality;

    if(profileFile) {
        try {
            const theUrl = await storeAPic(profileFile);

            const guest = new Guest({
                profileUrl: theUrl,
                name: name,
                phoneNo: number,
                level: quality
            });
            const newGuest = await guest.save();
            const feedback = await sendInvitationMessage({receiver: newGuest.phoneNo, link: `${process.env.FRONTEND_URL}${newGuest._id}`});
            return res.status(201).json({
                message: 'successfully contacted the guest',
                guest: newGuest
            })
        } catch(err) {
            console.log(err);
            return res.status(500).json({
                message: 'something went wrong server-side'
            })
        }
    } else {
        try {
            const guest = new Guest({
                name: name,
                phoneNo: number,
                level: quality
            });
            const newGuest = await guest.save();
            const feedback = await sendInvitationMessage({receiver: newGuest.phoneNo, link: `${process.env.FRONTEND_URL}${newGuest._id}`});
            return res.status(201).json({
                message: 'successfully contacted the guest',
                guest: newGuest
            })
        } catch(err) {
            console.log(err);
            return res.status(500).json({
                message: 'something went wrong server-side'
            })
        }
    }
}

exports.getAllGuests = async (req, res) => {
    try {
        const guests = await Guest.find();
        res.status(200).json({
            message: 'success',
            guests: guests
        })
    } catch(err) {
        res.status(500).json({
            message: 'something went wrong server-side'
        })
    }
}

exports.confirmGuestPresence = async (req, res) => {
    const guestId = req.body.id;

    try {
        const guest = await Guest.findById(guestId);
        guest.status = 'confirmed';
        const result = await guest.save();
        res.status(200).json({
            message: "confirmed guest's presence",
            guest: result
        })
    } catch(err) {
        res.status(500).json({
            message: 'something went wrong server-side'
        })
    }

}

exports.excludeGuest = async (req, res) => {
    const guestId = req.body.id;
    
    try {
        const guest = await Guest.findByIdAndDelete(guestId);
        res.status(200).json({
            message: 'guest successfully excluded',
            guest: guest
        })
    } catch(err) {
        res.status(500).json({
            message: 'something went wrong server-side'
        })
    }
}