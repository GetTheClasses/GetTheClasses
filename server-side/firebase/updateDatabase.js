const db = require('./database').database();
const fs = require('fs');
const _ = require('lodash');
const prompt = require('syncprompt');
const helper = require('../scripts/helper.js')
const path = require('path');
const folder = path.join(__dirname, '../', 'defaultData');

async function run() {
	
	// Get old data and new data
	var rawOldCourses = fs.readFileSync(path.join(folder, 'oldCoursesData.json'));
	var rawNewCourses = fs.readFileSync(path.join(folder, 'newCoursesData.json'));
	var oldCourses = JSON.parse(rawOldCourses);
	var newCourses = JSON.parse(rawNewCourses); 

	// Check if the two files are different
	if (!_.isEqual(oldCourses, newCourses)) {
		var diffResult = []
		for (var major = 0; major < newCourses.length; major++) {
			for (var key in newCourses[major]) {
				for (var i = 0; i < newCourses[major][key].length; i++) {

					// Prevent error such as missing major name from breaking the code.
					try {
						var diff = helper.compareJSON(oldCourses[major][key][i], 
							newCourses[major][key][i]);
						if (!_.isEmpty(diff)) {
							var criteria = newCourses[major][key][i]
							.courseName.split(' ');
							criteria.push(newCourses[major][key][i].crn)
							diffResult.push({
								criteria: criteria,
								differences: diff
							})
						}
					}
					catch (err) {
						fs.appendFileSync(path.join(__dirname, '../', 'log/error.txt'), err + "\n", () => {});
					}
				}
			}
		}

		// Log out differences as an object with identifier and characteristic to log window.
		console.log(diffResult);

		var answer = prompt('Do you want to update by create a whole new database? (Y/N) ');
		if (answer.toUpperCase() == "Y") {
			for (var eachDiff of diffResult) {
				console.log(eachDiff)

				// If there is a change in classTime, also update general info	
				if (eachDiff.differences.classTime != undefined) {
					var updateGeneral = {}
					for (var key in eachDiff.differences) {
						updateGeneral[key] = eachDiff.differences[key].split(" *VS* ")[1]
					}
					await db.ref('generalCoursesInfo/' + criteria[0] + '/'
						+ criteria[1] + '/')
					.orderByChild('crn').equalTo(criteria[2])
					.once('value').then(async function(eachClass) {
						var key = Object.keys(eachClass.val())[0];
						await db.ref('generalCoursesInfo/').child(criteria[0] + '/'
						+ criteria[1] + '/' + key).update(updateGeneral);
					});
				}

				// Update Detail if there is any change.
				var updateDetail = {}
				for (var key in eachDiff.differences) {
					updateDetail[key] = eachDiff.differences[key].split(" *VS* ")[1]
				}
				await db.ref('detailCoursesInfo/' + criteria[0] + '/'
					+ criteria[1] + '/')
				.orderByChild('crn').equalTo(criteria[2])
				.once('value').then(async function(eachClass) {
					var key = Object.keys(eachClass.val())[0];
					console.log(key);
					console.log(updateDetail);
					await db.ref('detailCoursesInfo/').child(criteria[0] + '/'
					+ criteria[1] + '/' + key).update(updateDetail);
				});
			}

			// Update data in oldCoursesData with data from newCoursesData
			fs.writeFileSync(path.join(folder, 'oldCoursesData.json'),
				JSON.stringify(newCourses, null, 2), (err) => {})
			fs.writeFileSync(path.join(folder, 'dataDifferences.json'),
				"", (err) => {console.log(err)});
			console.log('\nUpdated database');
		}

		// If choose not to update the database (Due to high number of unidentify differences)
		else {

			// Write differences to DefaultData/DataDifferences.json
			fs.writeFileSync(path.join(folder, 'dataDifferences.json'),
				JSON.stringify(diffResult, null, 2), (err) => {console.log(err)});
			console.log("\nDifferences has been saved to server-side/defaultData/dataDifferences.json");
		}
	}

	// If there is no difference between oldData and newData
	else {
		console.log("Data is up-to-date");
	}
}

module.exports = {
	run
}
