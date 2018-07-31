const db = require('../firebase/database');
const defaultFreeTime = require('../defaultData/freeTime');
const copy = require('./helper.js').copy;
const convertTime = require('./helper').convertTime

let runtimeDict = {};
let combinations = [];

// Fill a class in the schedule
function putClass(scheduleRoot, classTimeString) {
    let schedule = copy(scheduleRoot);
    classTime = classTimeString.split('|');
    for (var i = 0; i < classTime.length; i += 2) {
        var startTime = parseInt(classTime[i + 1].slice(0, 4));
        var endTime = parseInt(classTime[i + 1].slice(4));
        var dates = classTime[i].toLowerCase().split('');
        for (var j = 0; j < dates.length; j++) {
            date = dates[j];
            var flag = false;
            for (var periodIndex = 0; periodIndex < schedule[date].length; periodIndex++) {
                if (schedule[date][periodIndex][0] <= startTime && schedule[date][periodIndex][1] >= endTime) {
                    if (endTime != schedule[date][periodIndex][1]) {
                        schedule[date].splice(periodIndex + 1, 0, [endTime, schedule[date][periodIndex][1]]);
                    }
                    if (startTime != schedule[date][periodIndex][0]) {
                        schedule[date].splice(periodIndex + 1, 0, [schedule[date][periodIndex][0], startTime]);
                    }
                    schedule[date].splice(periodIndex, 1);
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                return {
                    data: {},
                    success: false
                }
            }
        };
    }
    return {
        data: schedule,
        success: true
    }
}

// Compare desired classes with available time, modify available time for each class.
function syncSchedule(courseList, freeTime, crnList = []) {
    if (courseList.length == 0) {
        combinations.push(crnList);
        return;
    }
    var allClasses = copy(courseList);
    var group = allClasses.splice(0, 1)[0];
    for (key in group) {
        runtimeDict[group[key].crn] = group[key];
        var newFreeTime = copy(freeTime);
        var execute = putClass(newFreeTime, group[key].time);
        if (execute.success) {
            var newCrnList = copy(crnList);
            newCrnList.push(group[key].crn);
            newFreeTime = execute.data;
            syncSchedule(allClasses, newFreeTime, newCrnList);
        }
    }
}

// Get all data for all the classes
async function reSchedule(courseList, freeTime, crnList = []) {
    var newCourseList = copy(courseList);

    var allClasses = [];
    if (!crnList.length) {
        for (course of courseList) {
            allClasses.push(await new Promise((resolve) => {
                db.ref('majors/' + course.major + '/' + course.courseNumber)
                    .once('value').then((courseInfo) => {
                        resolve(courseInfo.val());
                    });
            }));
        }
    } 
    syncSchedule(allClasses, freeTime, []);
}

// DFS through reSchedule function
async function main(course, freeTime = defaultFreeTime) {
    if (freeTime == null)
        freeTime = defaultFreeTime;
    await reSchedule(course, freeTime, []);
    for (combination of combinations) {
        for (var i = 0; i < combination.length; i++) {
            combination[i] = runtimeDict[combination[i]];
        }
    }
    var index = 0;
    while (index < combinations.length) {
        if (combinations[index].includes(undefined))
            combinations.splice(index, 1);
        else
            index += 1;
    }
    return combinations;
}

module.exports = main