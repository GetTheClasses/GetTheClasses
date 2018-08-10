var servicesData = require('../defaultData/dateTime');

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

// Reformat Professor style
function professorFormat(str) {
    if (str.slice(str.length - 3, str.length).includes('P')) {
        var output = 'P. ' + str.slice(0, str.length - 3);
    } else {
        var output = 'I. ' + str.slice(0, str.length - 3);
    }
    return output.trim();
}

// Get out the CRN number
function crnNumber(str) {
    var dashIndex = str.indexOf('-') + 1;
    var output = '';
    for (var i = dashIndex; i < str.length; i++) {
        if (str[i] == '-') {
            break;
        } else {
            output += str[i];
        }
    }
    return output.trim();
}

// Get out the section Letter of the course
function sectionLetter(str) {
    return str[str.length - 1];
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
    var output = '';
    var monthFormats = {
        "Jan": 01,
        "Feb": 02,
        "Mar": 03,
        "Apr": 04,
        "May": 05,
        "Jun": 06,
        "Jul": 07,
        "Aug": 08,
        "Sep": 09,
        "Oct": 10,
        "Nov": 11,
        "Dec": 12
    };
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

module.exports = {
	copy,
    compareJSON,
    timeFormat,
    convertTime,
	professorFormat,
	crnNumber,
	sectionLetter,
	classNumber,
	reformatDate
}