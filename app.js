const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const multer = require('multer');
// const bcrypt = require('bcrypt');
const Admin = require('./models/admin');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const guestRoutes = require('./routes/guest');

const app = express();

const fileFilter = (req, file, cb) => {
    if(
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'audio/mpeg' || 
        file.mimetype === 'application/pdf'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.use(cors({
    origin: '*',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization',
    methods: ['POST', 'GET', 'PUT', 'DELETE']
}));

// app.use('/', async (req, res, next) => {
//     const password = 'Dunia1212';
//     const email = 'test@test.com';

//     const hashedP = await bcrypt.hash(password, 12);

//     const admin = new Admin({
//         email: 'test@test.com',
//         password: hashedP
//     });

//     const response = await admin.save();
//     console.log(response);
//     next();
// })

app.use(express.json());
app.use(multer({fileFilter: fileFilter}).array('photos', 12));

app.use('/auth', authRoutes);
app.use(adminRoutes);
app.use(guestRoutes);

const PORT = process.env.PORT || 5000
mongoose.connect(process.env.MONGODB_URI)
.then(response => {
    const server = app.listen(PORT, () => {
        console.log('app is running on port '+ PORT);
    })

    const io = require('./utilities/socket').init(server);
    io.on('connection', socket => {
        console.log(`client ${socket.id} is connected`);

        socket.on('adminJoin', adminID => {
            socket.join(adminID);
            console.log(`admin ${socket.id} joined room ${adminID}`);
        })
    
        socket.on('confirmedPresence', guest => {
            Admin.find().then(admins => {
                admins.forEach(adm => {
                    console.log(adm._id.valueOf());
                    socket.to(adm._id.valueOf()).emit('gotConfirmation', guest);
                })
            })
        });

        socket.on('declinedInvite', guest => {
            Admin.find().then(admins => {
                admins.forEach(adm => {
                    socket.to(adm._id.valueOf()).emit('gotRejection', guest);
                })
            })
        })
    });

});