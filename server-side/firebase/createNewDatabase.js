const db = require('./database');
const fs = require('fs');
const _ = require('lodash');
const prompt = require('syncprompt');
const helper = require('../scripts/helper.js')

async function run() {
	var option = prompt("Are you really sure to create whole new Database? (Y/N)");
	if (option == "Y") {
		var rawNewCourses = fs.readFileSync('./defaultData/newCoursesData.json');
		var newCourses = JSON.parse(rawNewCourses); 
		db.ref('detailCoursesInfo').set({});
		db.ref('generalCoursesInfo').set({});
		db.ref('crn').set({});

		var promises = [];
		newCourses.forEach((eachMajor) => {
			var major = Object.keys(eachMajor)[0];
			try {
				eachMajor[major].forEach((eachCourse) => {
					var cnIndex = eachCourse.courseName.lastIndexOf(' ');
					var courseNumber = eachCourse.courseName.slice(cnIndex + 1);
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
				console.log(err);
			}
		})
		await Promise.all(promises);
		fs.writeFileSync('./defaultData/oldCoursesData.json',
			JSON.stringify(newCourses, null, 2), (err) => {})
		fs.writeFileSync('./defaultData/DataDifferences.json',
			"", (err) => {console.log(err)});
		console.log('\nCreated database');
	}
	else {
		console.log("Cancelled");
	}
}

module.exports = {
	run
}
