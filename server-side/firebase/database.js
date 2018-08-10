const firebase = require('firebase');

firebase.initializeApp({
    apiKey: "AIzaSyCPxuyldQzVJ05GSgDcMK8qthfC4ZJGvPI",
    authDomain: "gettheclassdevelop.firebaseapp.com",
    databaseURL: "https://gettheclassdevelop.firebaseio.com",
    projectId: "gettheclassdevelop",
    storageBucket: "",
    messagingSenderId: "760366761022"
});

let database = firebase.database();

module.exports = firebase.database();