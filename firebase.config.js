// Import the functions you need from the SDKs you need
const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');
require('dotenv').config();


const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "food-delivery-app-42557.firebaseapp.com",
    databaseURL: "https://food-delivery-app-42557-default-rtdb.firebaseio.com",
    projectId: "food-delivery-app-42557",
    storageBucket: "food-delivery-app-42557.appspot.com",
    messagingSenderId: "1022078276075",
    appId: "1:1022078276075:web:05a913fbda6ff0c611c9"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
module.exports = getStorage(app);