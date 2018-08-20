const authentication = require('../firebase/authentication');

async function signin(email, password) {
	var result = await authentication.login(email, password).catch(err => {
		return err;
	});
	if (result.user != undefined) {
		var at = result.user.email.indexOf("@");
		return {
			success: true,
			userID: result.user.uid,
			name: result.user.email.slice(0, at)
		}
	}
	else {
		if (result == 'auth/invalid-email') {
			return {
				success: false,
				error: "Invalid email address."
			}
		}
		else if (result == 'auth/user-disabled') {
			return {
				success: false,
				error: "Email has been disabled."
			}
		}
		else if (result == 'auth/user-not-found') {
			return {
				success: false,
				error: "Your username/password is incorrect."
			}
		}
		else {
			return {
				success: false,
				error: "Your username/password is incorrect."
			}
		}
	}
}

async function signup(email, password) {
	var result = await authentication.signup(email, password).catch(err => {
		return err
	});
	if (result.user != undefined && result.user.uid) {
		var at = result.user.email.indexOf("@");
		return {
			success: true,
			userID: result.user.uid,
			name: result.user.email.slice(0, at)
		}
	}
	else {
		if (result == 'auth/email-already-in-use') {
			return {
				success: false,
				error: "Email is already existed."
			}
		}
		else if (result == 'auth/invalid-email') {
			return {
				success: false,
				error: "The email you entered is not valid."
			}
		}
		else if (result == 'auth/weak-password') {
			return {
				success: false,
				error: "Your password is too weak."
			}
		}
		else {
			return {
				success: false,
				error: "Invalid username/password."
			}
		}
	}
}

async function resetPassword(email) {
	var result = await authentication.resetPassword(email).catch(err => {
		return err
	});
	if (result == undefined) {
		return {
			success: true
		}
	}
	else if (result == 'auth/user-not-found') {
		return {
			success: false,
			error: "Email not found."
		}
	}
	else {
		return {
			success: false,
			error: "Invalid email."
		}
	}
}

module.exports = {
	signin,
	signup,
	resetPassword
}