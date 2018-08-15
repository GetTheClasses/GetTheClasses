const db = require('./database').database;

async function getCourseDetailFromDB(major, courseNumber) {
	return new Promise(resolve => {
		db.ref('detailCoursesInfo/' + major + '/'
            + courseNumber + '/').once('value')
		.then((eachCourse) => {
			var result = [];
			for (var key in eachCourse.val()) {
				result.push(eachCourse.val()[key]);
			}
			resolve(result);
		})
	})
}

async function getCourseGeneralFromDB(major, courseNumber) {
	return new Promise(resolve => {
		db.ref('generalCoursesInfo/' + major + '/'
            + courseNumber + '/').once('value')
		.then((eachCourse) => {
			var result = [];
			for (var key in eachCourse.val()) {
				result.push(eachCourse.val()[key]);
			}
			resolve(result);
		})
	})
}

module.exports = {
	getCourseDetailFromDB,
	getCourseGeneralFromDB
}