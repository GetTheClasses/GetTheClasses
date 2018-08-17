const db = require('./database').database;

function saveUserFreeTime(userID, freeTime) {
    db.ref("users/").child(userID).set({})
    freeTime.forEach((eachFreeTime) => {
        db.ref("users/").child(userID).push(eachFreeTime);
    })
}

module.exports = {
    saveUserFreeTime
}