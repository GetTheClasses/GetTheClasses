const login = require('../authentication/login');

async function signin(email, password) {
	var result = await login(email, password).catch(err => {
		return err.message;
	})
	if (result.user != undefined) {
		var at = result.user.email.indexOf("@");
		var name = result.user.email.slice
		return {
			success: true,
			userID: result.user.uid,
			name: result.user.email.slice(0, at)
		}
	}
	else 
		return {
			success: false,
			error: result
		}
}

module.exports = {
	signin
}