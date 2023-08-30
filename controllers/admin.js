const { validationResult } = require('express-validator');
const { storeAPic } = require('../utilities/firebase.operations');
const { sendInvitationMessage, sendQRMessage } = require('../utilities/twilio.operations');
require('dotenv').config();
const Guest = require('../models/guest');
const Admin = require('../models/admin');

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
            const feedback = await sendInvitationMessage({receiver: newGuest.phoneNo, link: `${process.env.FRONTEND_URL}/${newGuest._id}`});
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
            const feedback = await sendInvitationMessage({receiver: newGuest.phoneNo, link: `${process.env.FRONTEND_URL}/${newGuest._id}`});
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

exports.getOrdinaryGuests = async (req, res) => {
    try {
        const guests = await Guest.find({level: 'ordinary'});
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

exports.getVipGuests = async (req, res) => {
    try {
        const guests = await Guest.find({level: 'vip'});
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

exports.getVvipGuests = async (req, res) => {
    try {
        const guests = await Guest.find({level: 'vvip'});
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

exports.getPendingInviteGuests = async (req, res) => {
    try {
        const guests = await Guest.find({status: 'pending'});
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

exports.getConfirmedInviteGuests = async (req, res) => {
    try {
        const guests = await Guest.find({status: 'confirmed'});
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

exports.getDeclinedInviteGuests = async (req, res) => {
    try {
        const guests = await Guest.find({status: 'excluded'});
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

exports.checkQRStatus = async (req, res) => {
    const adminID = req.userId;
    try {
        const theAdmin = await Admin.findById(adminID);
        console.log(theAdmin);
        if(theAdmin.sentInvites === 'true') {
            res.status(200).json({
                sent: true
            });
        } else {
            res.status(200).json({
                sent: false
            });
        }
    }
    catch(err) {
        res.status(500).json({
            message: 'something went wrong server-side'
        })
    }
}

exports.sendQRMessages = async (req, res) => {
    const adminID = req.userId;
    try {
        const guests = await Guest.find();
        guests.forEach(guest => {
            if(guest.status === 'confirmed') {
                sendQRMessage({receiver: guest.phoneNo, link: `${process.env.FRONTEND_URL}/myQRCode/${guest._id}`})
                .then(feedback => {
                    console.log(feedback);
                })
            }
        });
        const theAdmin = await Admin.findById(adminID);
        theAdmin.sentInvites = 'true';
        const resultHere = await theAdmin.save();
        res.status(200).json({
            message: 'successfully sent QR Messages'
        })
    } catch(err) {
        res.status(500).json({
            message: 'something went wrong server-side'
        })
    }
}

exports.scanQRCode = async (req, res) => {
    const theID = req.body.theID;

    try {
        const guest = await Guest.findById(theID);
        if(!guest) {
            return res.status(500).json({
                message: "guest doesn't exist"
            })
        }

        if(guest.inside) {
            return res.status(200).json({
                guest: guest,
                message: "guest is already in"
            })
        } 
        if(guest.status !== 'confirmed') {
            return res.status(200).json({
                guest: guest,
                message: "guest never confirmed presence!"
            })
        }
        
        res.status(200).json({
            message: 'Allow guest in!',
            guest: guest
        })
    } catch(err) {
        return res.status(500).json({
            message: "something went wrong server-side"
        })
    }
}

exports.allowGuestIn = async (req, res) => {
    const theID = req.body.theID;
    try {
        const theGuest = await Guest.findById(theID);
        theGuest.inside = true;
        const result = await theGuest.save();
        res.status(200).json({
            message: 'guest allowed in!'
        })
    } catch(err) {
        res.status(500).json({
            message: "something went wrong server-side"
        })
    }
    
}