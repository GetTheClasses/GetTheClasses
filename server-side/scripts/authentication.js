const login = require('../authentication/login');

async function signin(email, password) {
	var result = await login(email, password).catch(err => {
		return err.message;
	})
	if (result.user != undefined)
		return {
			success: true,
			userID: result.user.uid
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