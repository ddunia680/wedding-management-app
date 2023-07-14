const Guest = require('../models/guest');

exports.confirmPresence = async (req, res) => {
    const guestId = req.params.id;
    
    try {
        const guest = await Guest.findById(guestId);
        if(guest.status === 'confirmed') {
            return res.status(401).json({
                message: 'presence already confirmed!'
            })
        }

        if(guest.status === 'declined') {
            return res.status(401).json({
                message: 'invitation already declined!'
            })
        }

        guest.status = 'confirmed';
        const result = await guest.save();
        res.status(200).json({
            message: "confirmed guest's presence",
            guest: result
        })
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: 'something went wrong server-side'
        })
    }
}

exports.declinePresence = async (req, res) => {
    const guestId = req.params.id;

    try {
        const guest = await Guest.findById(guestId);
        if(guest.status === 'confirmed') {
            return res.status(401).json({
                message: 'presence already confirmed!'
            })
        }

        if(guest.status === 'declined') {
            return res.status(401).json({
                message: 'invitation already declined!'
            })
        }
        guest.status = 'excluded';
        const result = await guest.save();
        res.status(200).json({
            message: "invitation successfully declined",
            guest: result
        })
    } catch(err) {
        res.status(500).json({
            message: 'something went wrong server-side'
        })
    }
}

exports.pullGuestInfo = async (req, res) => {
    const guestId = req.params.id;
    // console.log(guestId);

    try {
        const guest = await Guest.findById(guestId);
        res.status(200).json({
            message: `welcome dear ${guest.name}`,
            guest: guest
        })
    } catch(err) {
        // console.log(err);
        res.status(500).json({
            message: 'something went wrong server-side'
        })
    }
}

exports.getQRString = async (req, res) => {
    const guestId = req.params.id;
    console.log(guestId);

   Guest.find({_id: guestId, status: 'confirmed'})
   .then(guest => {
        if(!guest) {
            res.status(404).json({
                message: "This guest doesn't exist or isn't confirmed!"
            })
        } else {
            const theString = guest._id + guest.level + guest.createdAt + guest.phoneNo;
            res.status(200).json({
                string: theString
            })
        }
        
   })
   .catch(err => {
        res.status(500).json({
            message: "Something went wrong server-side"
        })
   })
}