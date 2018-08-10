const db = require('./database');
const fs = require('fs');
const _ = require('lodash');
const read = require('readline-sync');
const helper = require('../Scripts/helper.js')

async function run() {
	var rawOldCourses = fs.readFileSync('./DefaultData/oldCoursesData.json');
	var rawNewCourses = fs.readFileSync('./DefaultData/newCoursesData.json');
	var oldCourses = JSON.parse(rawOldCourses);
	var newCourses = JSON.parse(rawNewCourses); 

	if (!_.isEqual(oldCourses, newCourses)) {
		var diffResult = []
		for (var major = 0; major < newCourses.length; major++) {
			for (var key in newCourses[major]) {
				for (var i = 0; i < newCourses[major][key].length; i++) {
					var diff = helper.compareJSON(oldCourses[major][key][i], 
						newCourses[major][key][i]);
					if (!_.isEmpty(diff)) {
						diffResult.push({
							crn: newCourses[major][key][i].crn,
							differences: diff
						})
					}
				}
			}
		}

		console.log(diffResult);
		var answer =read.question('Do you want to update by create a whole new database? (Y/N) ');
		if (answer.toUpperCase() == "Y") {
			db.ref('detailCoursesInfo').set({});
			db.ref('generalCoursesInfo').set({})

			for (var i of newCourses) {
				for (var key in i) {
					for (var e of i[key]) {
						var cnIndex = e.courseName.lastIndexOf(' ');
						var courseNumber = (e.courseName
							.slice(cnIndex + 1));
						var major = key;
						if (e.classTime != undefined) {
							await db.ref('detailCoursesInfo/' + major 
								+ "/" + courseNumber).push(e);
							await db.ref('generalCoursesInfo/' + major
								+ "/" + courseNumber).push({
								crn: e.crn,
								time: e.classTime
							})
						}
					}
				}
			}
			fs.writeFileSync('./DefaultData/oldCoursesData.json',
				JSON.stringify(newCourses, null, 2), (err) => {})
			fs.writeFileSync('./DefaultData/DataDifferences.json',
				"", (err) => {console.log(err)});
			console.log('\nUpdated database');
		}
		else {
			fs.writeFileSync('./DefaultData/DataDifferences.json',
				JSON.stringify(diffResult, null, 2), (err) => {console.log(err)});
			console.log("\nDifferences has been saved to server-side/DefaultData/DataDifferences.json");
		}
	}
	else {
		console.log("File is up-to-date");
	}
}

module.exports = {
	run
}
