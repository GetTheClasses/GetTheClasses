const db = require('./database');

const fs = require('fs')

var rawData = fs.readFileSync('../DefaultData/courseData.json');
var data = JSON.parse(rawData);

db.ref('detailCoursesInfo').set({});
db.ref('generalCoursesInfo').set({})

for (var i of data) {
	for (var key in i) {
		for (var e of i[key]) {
			var cnIndex = e.courseName.lastIndexOf(' ');
			var courseNumber = (e.courseName
				.slice(cnIndex + 1));
			var major = key;
			if (e.classTime != undefined) {
				db.ref('detailCoursesInfo/' + major 
					+ "/" + courseNumber).push(e);
				db.ref('generalCoursesInfo/' + major
					+ "/" + courseNumber).push({
						crn: e.crn,
						time: e.classTime
					})
			}
		}
	}
}