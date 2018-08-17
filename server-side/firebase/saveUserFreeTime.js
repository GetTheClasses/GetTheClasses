const db = require('./database').database;

module.exports = function(userID, freeTime) {
    db.ref("users/").child(userID).set({})
    freeTime.forEach((eachFreeTime) => {
        db.ref("users/").child(userID).push(eachFreeTime);
    })
}