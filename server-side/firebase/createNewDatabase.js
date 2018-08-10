const db = require('./database');
const fs = require('fs');
const _ = require('lodash');
const read = require('readline-sync');
const helper = require('../scripts/helper.js')

async function run() {
	var rawNewCourses = fs.readFileSync('./defaultData/newCoursesData.json');
	var newCourses = JSON.parse(rawNewCourses); 
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
	fs.writeFileSync('./defaultData/oldCoursesData.json',
		JSON.stringify(newCourses, null, 2), (err) => {})
	fs.writeFileSync('./defaultData/DataDifferences.json',
		"", (err) => {console.log(err)});
	console.log('\nCreated database');
}

module.exports = {
	run
}
