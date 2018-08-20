const db = require('./database').database;
const firebase = require('../firebase/database').firebase

async function login(email, password) {
	return new Promise(resolve => {
		resolve(firebase.auth().signInWithEmailAndPassword(email, password)
			.catch(err => {
				return err.code
            })
        )
	})
}

async function signup(email, password) {
    return new Promise(resolve => {
        resolve(firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch(err => {
				return err.code
            })
        )
    })
}

function saveUserFreeTime(userID, freeTime) {
    db.ref("users/").child(userID).set({})
    freeTime.forEach((eachFreeTime) => {
        db.ref("users/").child(userID).push(eachFreeTime);
    })
}

async function resetPassword(email) {
    return new Promise(resolve => {
        resolve(firebase.auth().sendPasswordResetEmail(email).catch(err => {
            return err.code
        }));
    })
}

module.exports = {
    login,
    signup,
    saveUserFreeTime,
    resetPassword
}