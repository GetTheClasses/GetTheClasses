const database = require('./database');

async function readSpecific(url, key, value) {
	return new Promise((resolve) => {
		database.ref(url).orderByChild(key).equalTo(value)
		.once('value').then((snapshot) => {
			// console.log(snapshot.val())
			var result = [];
			for (key in snapshot.val()) {
				result.push(snapshot.val()[key]);
			}
			console.log(result)
			resolve(result);
		});
	})
}


// Ex: readSpecific('detailCourses/ACCT/2101', 'crn', "87484");
readSpecific('generalCoursesInfo/ACCT/2101', 'crn', "87484")

async function moveObject(oldLocation, newLocation) {
	var temp = await new Promise(resolve => {
		database.ref(oldLocation).once("value").then((val) => {
			resolve(val.val());
		})
	})
	await new Promise(resolve => {
		database.ref(oldLocation).set({});
		database.ref(newLocation).set(temp);
	});
}

module.exports = {
	moveObject,
	readSpecific
}