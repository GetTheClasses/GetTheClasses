const db = require('./database');

async function getClassDetailWithCrnFromDB(crn) {
	return new Promise(resolve => {
		db.ref('crn/' + crn).once('value').then((eachClass) => {
        	var key = Object.keys(eachClass.val())[0];
            resolve(eachClass.val()[key]);
        });
	})	
}

async function getClassGeneralWithCrnFromDB(major, courseNumber, crn) {
	return new Promise(resolve => {
		db.ref('generalCoursesInfo/' + major + '/'
            + courseNumber + '/')
        .orderByChild('crn').equalTo(crn)
        .once('value').then((eachClass) => {
        	var key = Object.keys(eachClass.val())[0];
            resolve(eachClass.val()[key]);
        });
	})	
}

async function getAllClassesInCourse(major, courseNumber) {
    return new Promise(resolve => {
        db.ref('generalCoursesInfo/' + major)
        .child(courseNumber).once('value').then((data) => {
            var result = [];
            Object.keys(data.val()).forEach((key) => {
                result.push(data.val()[key]);
            })
            resolve(result);
        })
    })
}

// (async function() {
//     await getAllClassesInCourse('CS', '1331');
// })()

module.exports = {
	getClassDetailWithCrnFromDB,
	getClassGeneralWithCrnFromDB,
    getAllClassesInCourse
}