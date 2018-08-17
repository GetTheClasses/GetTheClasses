require('dotenv').config();
const getClass = require('../firebase/getClassFromDB');
const getCourse = require('../firebase/getCourseFromDB');
const getCourseCatalog = require('../firebase/getCourseCatalog');
const db = require('../firebase/database').database;

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

async function getAllClassesInCourse(major, courseNumber) {
	return await getClass.getAllClassesInCourse(major, courseNumber);
}

async function fetchDataOfUser(userID) {
	return await new Promise(resolve  => {
		db.ref('users').child(userID).once('value').then(data => {
			let result = data.val()
			let response = []
			Object.keys(result).forEach(key => {
				response.push(result[key])
			})
			resolve(response);
		})
	})
}

module.exports = {
	getClassDetailWithCrn,
	getClassGeneral,
	getCourseDetail,
	getCourseGeneral,
	getAllMajorsName,
	getAllMajorsAndCourseNumbers,
	getSpecificMajorCourseNumbers,
	getAllClassesInCourse,
	fetchDataOfUser
}