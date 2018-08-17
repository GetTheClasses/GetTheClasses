const firebase = require('../firebase/database').firebase

async function login(email, password) {
	return new Promise((resolve,reject) => {
		resolve(firebase.auth().signInWithEmailAndPassword(email, password)
			.catch(err => {
				return err.message
			}))
	})
}

module.exports = login