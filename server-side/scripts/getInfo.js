require('dotenv').config();
const getClass = require('../firebase/getClassFromDB');
const getCourse = require('../firebase/getCourseFromDB');

async function getClassDetailWithCrn(crn) {
	return await getClass.getClassDetailWithCrnFromDB(crn);
}

async function getClassGeneral(major, courseNumber, crn) {
	return await getClass.getClassGeneralWithCrnFromDB(major, courseNumber, crn);
}

async function getCourseDetail(major, courseNumber) {
	return await getCourse.getCourseDetailFromDB(major, courseNumber);
}

async function getCourseGeneral(major, courseNumber) {
	return await getCourse.getCourseGeneralFromDB(major, courseNumber);
}

module.exports = {
	getClassDetailWithCrn,
	getClassGeneral,
	getCourseDetail,
	getCourseGeneral
}