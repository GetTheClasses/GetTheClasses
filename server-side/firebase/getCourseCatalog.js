const db = require('./database');

async function getMajors() {
	return new Promise(resolve => {
		db.ref('courseCatalog').child('majors')
		.once('value').then((data) => {
			var allMajors = []
			Object.keys(data.val()).forEach((major) => {
				allMajors.push(data.val()[major])
			})
			resolve(allMajors);
		})
	})
}

async function getAllMajorsAndCourseNumbers() {
	return new Promise(resolve => {
		db.ref('courseCatalog').child('courseNumber')
		.once('value').then((data) => {
			var result = {}
			Object.keys(data.val()).forEach((data1) => {
				var major = data.val()[data1];
				var courseNumbers = [];
				Object.keys(major).forEach((courseNumber) => {
					courseNumbers.push(major[courseNumber]);
				})
				result[data1] = courseNumbers;
			})
			resolve(result);
		})
	})
}

async function getSpecificMajorCourseNumbers(major) {
	return new Promise(resolve => {
		db.ref('courseCatalog').child('courseNumber/' + major)
		.once('value').then((data) => {
			var courseNumbers = [];
			Object.keys(data.val()).forEach((courseNumber) => {
				courseNumbers.push(data.val()[courseNumber]);
			})
			resolve(courseNumbers);
		})
	})
}

module.exports = {
	getMajors,
	getAllMajorsAndCourseNumbers,
	getSpecificMajorCourseNumbers
}