const path = require('path');
require('dotenv').config({path: path.join(__dirname, "../.env")});
const firebase = require('firebase');

firebase.initializeApp({
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    databaseURL: process.env.DATABASEURL,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID
});

let database = firebase.database();

module.exports = {
	database,
	firebase
}