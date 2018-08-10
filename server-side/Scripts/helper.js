const servicesData = require('../DefaultData/dateTime.js');
// Deep copy an object (or array)
function copy(object) {
	return JSON.parse(JSON.stringify(object));
}


// Compare two JSON objects
function compareJSON(obj1, obj2) {
    var ret = {}
  for(var i in obj2) {
    if(!obj1.hasOwnProperty(i) || obj2[i] !== obj1[i]) {
      ret[i] = obj1[i] + " *VS* " + obj2[i];
    }
  }
  return ret;
};

// Time convert format from 12 HR to 24 HR
function timeFormat(str) {
    var afterSplit = str.split('-');
    var output = '';

    for (var ele of afterSplit) {
        var timeSet = ele.slice(ele.length - 3, ele.length).trim(); //am or pm
        var timeBlock = ele.slice(0, ele.indexOf(timeSet)).trim(); // 9:05 , 9:55
        var timePre = timeBlock.slice(0, timeBlock.indexOf(':'));

        if (timeSet === 'am') {
            if (timePre.length == 1) {
                timeBlock = '0' + timeBlock;
                timeBlock.replace(':', '');
            }
        } else if (timeSet === 'pm') {
            if (parseInt(timePre) != 12) {
                timeBlock = (parseInt(timePre) + 12).toString() + ele.slice(ele.indexOf(':'), ele.indexOf(':') + 3);
            }
        }
        output += timeBlock.replace(':', '');;
    }
    return output;
}

// Transform from ['12001330','14001550'] to [[1200, 1330], [1400, 1550]]
function convertTime(timeList) {
    var response = [];
    timeList.forEach((time) => {
        response.push([parseInt(time.slice(0, 4)), parseInt(time.slice(4))]);
    })
    return response;
}

function instructorType(str) {
    if (str.slice(str.length - 3, str.length).includes('P')) {
        var output = 'P. ' + str.slice(0, str.length - 3);
    } else if (str.slice(str.length - 3, str.length).includes('I')) {
        var output = 'I. ' + str.slice(0, str.length - 3);
    } else if (str.slice(str.length - 3, str.length) != 'TBA') {
        var output = str.slice(0, str.length - 3);
    } else {
        var output = 'TBA';
    }
    return output.trim();
}

// Reformat Professor style
function professorFormat(str) {
    var output = instructorType(str);
    return output.trim();
}

// Get out the CRN number
function crnNumber(str) {
    var dashIndex = str.indexOf('-') + 1;
    var value = '';
    for (var i = dashIndex; i < str.length; i++) {
        if (str[i] == '-') {
            break;
        } else {
            value += str[i];
        }
    }
    value = value.trim();
    if (isNaN(parseInt(value))) {
        var output = str.slice(str.indexOf('-') + value.length + 3, str.indexOf('-') + value.length + 9);
    } else {
        var output = value;
    }
    return output.trim();
}

// Get out the section Letter of the course
function sectionLetter(str) {
    return str.slice(str.lastIndexOf('-') + 1, str.length).trim();
}


// Get out the shortcut class number
function classNumber(str) {
    var dashIndex = str.lastIndexOf('-') - 1;
    var output = '';
    while (str[dashIndex] != '-') {
        output += str[dashIndex];
        dashIndex--;
    }
    return output.split("").reverse().join("").trim();
}

// Reformat the date
function reformatDate(str) {
    var monthFormats = {
        "Jan": '01',
        "Feb": '02',
        "Mar": '03',
        "Apr": '04',
        "May": '05',
        "Jun": '06',
        "Jul": '07',
        "Aug": '08',
        "Sep": '09',
        "Oct": '10',
        "Nov": '11',
        "Dec": '12'
    };
    var output = '';
    var dateSplit = str.split('-');
    for (var ele of dateSplit) {
        var timeRange = ele.trim();
        var month = monthFormats[timeRange.slice(0, 3)];
        var day = timeRange.slice(4, timeRange.indexOf(','));
        var year = timeRange.slice(timeRange.length - 4, timeRange.length);
        var fullDate = month + '/' + day + '/' + year;
        output += '|' + fullDate;
    }
    return output.slice(1, output.length); 	// Format: MM/DD/YYYY
}

// Get out the credit number
function findCredit(str) {
    console.log(str);
    return str.slice(str.indexOf('.000 Credits') - 1, str.indexOf('.000 Credits')) + '.00';
}
// console.log(findCredit(    "Aero Sys Design Comp I \nAssociated Term: Fall 2018 \nRegistration Dates: Mar 26, 2018 to Aug 24, 2018 \nLevels: Graduate Semester, Undergraduate Semester \n\nGeorgia Tech-Atlanta * Campus \nLecture/Supervised Lab* Schedule Type \n3.000 Credits \nGrade Basis: L \nView Catalog Entry \n\nScheduled Meeting Times\nType\tTime\tDays\tWhere\tDate Range\tSchedule Type\tInstructors\nClass\t6:00 pm - 8:45 pm\tTR\tGuggenheim 244\tAug 20, 2018 - Dec 13, 2018\tSupervised Laboratory*\tDimitrios N Mavris (P), Carl Christopher Johnson \nClass\t4:30 pm - 5:20 pm\tT\tGuggenheim 244\tAug 20, 2018 - Dec 13, 2018\tLecture*\tDimitrios N Mavris (P), Carl Christopher Johnson \n\n\n"
// ))

function scheduleData(str) {
    var actualStr = str.slice(82, str.length);
    var arr = actualStr.split('\n');
    var dateTime = '';
    var location = '';
    var timeRange = '';
    var classType = '';
    var professor = '';

    for (var ele of arr) {
        data = ele.split('\t');
        var hold1 = false;
        var hold2 = false;
        for (var j = 1; j < data.length; j++) {
            switch (j) {
                case 1:
                    startTime = timeFormat(data[j]);
                    if (startTime == '') {
                        startTime = 'TBA';
                    }
                    hold1 = true;
                    break;

                case 2:
                    dates = data[j];
                    hold2 = true;
                    break;

                case 3:
                    location += '|' + data[j];
                    if (location == ' ') {
                        location = 'TBA';
                    }
                    break;

                case 4:
                    timeRange = reformatDate(data[j]);
                    break;

                case 5:
                    classType += '|' + data[j].slice(0, data[j].length - 1);
                    break

                case 6:
                    professor += '|' + professorFormat(data[j]);
                    break
            }
        }
        if (hold1 && hold2) {
            dateTime += dates + '|' + startTime + '|';
        }
    }
    var output = {
        "classTime": dateTime.slice(0, dateTime.length -1).trim(),
        "location": location.slice(1, location.length),
        "startEnd": timeRange,
        "classType": classType.slice(1, classType.length),
        "professor": professor.slice(1, professor.length)
    };
    return output;
}

module.exports = {
	copy,
    compareJSON,
    timeFormat,
    convertTime,
	professorFormat,
	crnNumber,
	sectionLetter,
	classNumber,
    reformatDate,
    findCredit,
    scheduleData
}