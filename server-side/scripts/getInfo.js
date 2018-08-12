require('dotenv').config();
const getClass = require('../firebase/getClassFromDB');
const getCourse = require('../firebase/getCourseFromDB');
const getCourseCatalog = require('../firebase/getCourseCatalog');

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

async function getAllMajorsName() {
	return await getCourseCatalog.getMajors();
}

async function getAllMajorsAndCourseNumbers() {
	return await getCourseCatalog.getAllMajorsAndCourseNumbers();
}

async function getSpecificMajorCourseNumbers(major) {
	return await getCourseCatalog.getSpecificMajorCourseNumbers(major);
}

module.exports = {
	getClassDetailWithCrn,
	getClassGeneral,
	getCourseDetail,
	getCourseGeneral,
	getAllMajorsName,
	getAllMajorsAndCourseNumbers,
	getSpecificMajorCourseNumbers
}