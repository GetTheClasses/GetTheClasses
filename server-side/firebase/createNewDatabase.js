const db = require('./database');
const fs = require('fs');
const _ = require('lodash');
const prompt = require('syncprompt');
const helper = require('../scripts/helper.js')
const path = require('path');
const folder = path.join(__dirname, '../', 'defaultData');

async function run() {
	var option = prompt("Are you really sure to create whole new Database? (Y/N)");
	if (option == "Y") {
		var rawNewCourses = fs.readFileSync(path.join(folder, 'newCoursesData.json'));
		var newCourses = JSON.parse(rawNewCourses); 
		db.ref('detailCoursesInfo').set({});
		db.ref('generalCoursesInfo').set({});
		db.ref('crn').set({});
		db.ref('courseCatalog').set({});

		var promises = [];
		newCourses.forEach((eachMajor) => {
			var major = Object.keys(eachMajor)[0];
			promises.push(new Promise(resolve => {
				db.ref('courseCatalog').child('majors').push(major);
			}))
			courseNumbers = new Set([]);
			try {
				eachMajor[major].forEach((eachCourse) => {
					var cnIndex = eachCourse.courseName.lastIndexOf(' ');
					var courseNumber = eachCourse.courseName.slice(cnIndex + 1);
					courseNumbers.add(courseNumber);
					if (eachCourse.classTime != undefined) {
						promises.push(new Promise(resolve => {
							db.ref('crn/' + eachCourse.crn).push(eachCourse);
						}));
						promises.push(new Promise(resolve => {
							db.ref('detailCoursesInfo/' + major
								+ "/" + courseNumber).push(eachCourse);
						}));
						promises.push(new Promise(resolve => {
							db.ref('generalCoursesInfo/' + major
								+ "/" + courseNumber).push({
									crn: eachCourse.crn,
									time: eachCourse.classTime
								})
						}))
					}
				})
			}
			catch (err) {
				console.log(eachMajor)
				console.log(err);
			}
			courseNumbers.forEach((courseNumber) => {
				promises.push(new Promise(resolve => {
					db.ref('courseCatalog').child('courseNumber/' + major).push(courseNumber);
				}))
			})
		})
		await Promise.all(promises);
		fs.writeFileSync(path.join(folder, 'oldCoursesData.json'),
			JSON.stringify(newCourses, null, 2), (err) => {})
		fs.writeFileSync(path.join(folder, 'dataDifferences.json'),
			"", (err) => {console.log(err)});
		console.log('\nCreated database');
	}
	else {
		console.log("Cancelled");
	}
}

(async function() {
	await run();
})()

module.exports = {
	run
}
