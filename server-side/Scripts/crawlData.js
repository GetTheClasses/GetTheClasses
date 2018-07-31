const puppeteer = require('puppeteer');
const servicesData = require('../defaultData/dateTime.js');
const url = 'https://oscar.gatech.edu/pls/bprod/bwckschd.p_disp_dyn_sched';
const semester = servicesData.semesters['Fall 2018'];
const fs = require('fs');

function crawlSubjects() {
    let scrape = async () => {

        // Setup
        const browser = await puppeteer.launch({headless: true});
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

        // Wrap get function in a function
        async function getMajor(major = "ACCT") {
            try {
                // Setup
                const browser = await puppeteer.launch({ headless: true });
                const page = await browser.newPage();
                await page.goto(url);
                await page.waitFor(1000);

                // Select Terms
                await page.select('body > div.pagebodydiv > form > table > tbody > tr > td > select', semester);
                await page.click('body > div.pagebodydiv > form > input[type="submit"]:nth-child(5)');
                await page.waitFor(3000);

                // Select Subjects to move on
                await page.select('#subj_id', major);
                await page.waitFor(1000);
                await page.click('body > div.pagebodydiv > form > input[type="submit"]:nth-child(15)');
                //await page.waitForNavigation({
                //    waitUntil: 'networkidle0',
                //    timeout: 35000
                //});
                await page.waitForSelector(".ntdefault");

                await page.addScriptTag({ path: './helper.js' });
                const output = await page.evaluate((major) => {

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
                                index++;
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
                            index++;
                            staffs.push(value);
                        }
                        nested.push(staffs);
                        dataOut[major] = nested;
                        index++;
                        val += 7;
                    }

                    return dataOut;
                }, major)

                // Return a value
                browser.close();
                return {
                    success: true,
                    data: output
                }
            }
            catch (err) {
                browser.close()
                return {
                    success: false,
                    data: [major, err]
                }
            }
            
        }

        let errorData = [];
        fs.writeFile("text.txt", "", () => { });
        fs.writeFile("errorKey.txt", "", () => { });
        fs.writeFile("error.txt", "", () => { });
        for (key in result) {
            console.log(key);
            var response = await getMajor(key);
            if (!response.success) {
                fs.appendFile("errorKey.txt", response.data[0], () => { });
                fs.appendFile("error.txt", JSON.stringify(response.data[1]), () => { })
            }
            else {
                fs.appendFile("text.txt", JSON.stringify(response.data, null, 4), () => { });
            }
        }

        return allData;
    };

  scrape().then((value) => {
    //console.log(value);
});
}
crawlSubjects()

module.exports = {
    crawlSubjects
}
