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

module.exports = {
	getClassDetailWithCrnFromDB,
	getClassGeneralWithCrnFromDB
}