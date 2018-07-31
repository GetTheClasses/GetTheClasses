const puppeteer = require('puppeteer');
const servicesData = require('../defaultData/dateTime.js');
const url = 'https://oscar.gatech.edu/pls/bprod/bwckschd.p_disp_dyn_sched';
const semester = servicesData.semesters['Fall 2018'];

function crawlSubjects() {
    let scrape = async () => {

        // Setup
        const browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto(url);
        await page.waitFor(1000);

        // Select Terms
        await page.select('body > div.pagebodydiv > form > table > tbody > tr > td > select', semester);
        await page.click('body > div.pagebodydiv > form > input[type="submit"]:nth-child(5)');
        await page.waitFor(3000);

        // Subjects Listings
        const result = await page.evaluate(() => {
            let elements = document.querySelectorAll('.dataentrytable .dedefault #subj_id option');
            var dictionary = {};
            for (var i = 0; i < elements.length; i++) {
                var shortCut = elements[i]['value'];
                var subject = elements[i].innerText;
                dictionary[shortCut] = subject;
            }
            return dictionary;
        })

        // Select Subjects to move on
        await page.select('#subj_id', 'ACCT');
        await page.waitFor(1000);
        await page.click('body > div.pagebodydiv > form > input[type="submit"]:nth-child(15)');
        await page.waitFor(3000);

        const output = await page.evaluate(() => {
            console.log(123);

            // HELPER METHODS

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

            // Get out the shortcut class number
            function classNumber(str) {
                var dashIndex = str.lastIndexOf('-') - 1;
                var output = '';
                while (str[dashIndex] != '-') {
                    output += str[dashIndex];
                    dashIndex --;
                }
                return output.split("").reverse().join("").trim();
            }

            // Get out the section Letter of the course
            function sectionLetter(str) {
                return str[str.length - 1];
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
                    var month = monthFormats[timeRange.slice(0,3)];
                    var day = timeRange.slice(4, timeRange.indexOf(','));
                    var year = timeRange.slice(timeRange.length - 4, timeRange.length);
                    var fullDate = month + '/' + day + '/' + year;
                    output += '|' + fullDate;
                }
                return output.slice(1, output.length); 	// Format: MM/DD/YYYY
            }

            // Initlize Variables
            var val = 7;
            var index = 1;
            var timeRange = '';
            var dataOut = {};
            var nested = [];
            let elements = document.querySelectorAll('.ddtitle');
            let details = document.querySelectorAll('.datadisplaytable .dddefault td');

            for (var i = 0; i < elements.length; i++) {
                var staffs = [];
                let courseName = elements[i].innerText;
                let classSectionVal = classNumber(courseName);
                let sectionNum = sectionLetter(courseName);
                let CRN = crnNumber(courseName);
                staffs = [courseName, classSectionVal, sectionNum, CRN];

                while (index < val) {
                    var value = details[index].innerText;

                    if (value.includes('-') && (value.includes('am') || value.includes('pm'))) { // detect time => convert to 24HR
                        value = timeFormat(value);
                        timeRange = value;
                        index ++;
                        continue;
                    }
                    else if (value.includes('(') || value.includes(')')) { // detect professor
                        value = professorFormat(value);
                    }
                    else if (value.includes('MWF') || value.includes('MW') || value.includes('TR') || value.includes('MTWR')) { // detect time range
                        value = value + '|' + timeRange;
                    }
                    else if (value.includes('*')) {
                        value = value.replace('*', '');
                    } else if (((value.includes('Jan')) && (value.includes('May'))) || ((value.includes('Aug')) && (value.includes('Dec')))) { // detect time date range
                        value = reformatDate(value);
                    }
                    index ++;
                    staffs.push(value);
                }
                nested.push(staffs);
                dataOut['ACCT'] = nested;
                index ++;
                val += 7;
            }

            return dataOut;
        })

        // Return a value
        browser.close()
        return output;
    };

  scrape().then((value) => {
    console.log(value);
});
}
crawlSubjects()

module.exports = {
    crawlSubjects
}
