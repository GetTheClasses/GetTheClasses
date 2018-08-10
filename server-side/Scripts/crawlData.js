const puppeteer = require('puppeteer');
const servicesData = require('../defaultData/dateTime.js');
const url = 'https://oscar.gatech.edu/pls/bprod/bwckschd.p_disp_dyn_sched';
const semester = servicesData.semesters['Fall 2018'];
const fs = require('fs');
// const EventEmitter = require('events');

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

        // Collect all Subjects Listings
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
                // Select Subjects to move on
                try {
                    const browser = await puppeteer.launch({ headless: true});
                    const page = await browser.newPage();
                    await page.goto(url);
                    await page.waitFor(1000);

                    // Select Terms
                    await page.select('body > div.pagebodydiv > form > table > tbody > tr > td > select', semester);
                    await page.click('body > div.pagebodydiv > form > input[type="submit"]:nth-child(5)');
                    await page.waitFor(3000);

                    await page.waitFor(1000);
                    await page.select('#subj_id', major);
                    // await page.waitFor(1000);
                    await page.click('body > div.pagebodydiv > form > input[type="submit"]:nth-child(15)');
                    await page.waitForSelector(".ntdefault");
                    // await page.waitFor(1000);

                    await page.addScriptTag({ path: './helper.js' });
                    const output = await page.evaluate((major) => {

                        // Initlize Variables
                        var dataOut = {};
                        var nested = [];
                        // var creditData = [];
                        var counting = [];
                        // var idx = 8;
                        let elements = document.querySelectorAll('.ddtitle');
                        // let creditHours = document.querySelectorAll('tbody td');
                        let csClasses = document.querySelectorAll('table .datadisplaytable');

                        // In case of no class found.
                        if (elements.length == 0) {
                            dataOut[major] = {};
                        }

                        // Append class stuffs information
                        for (var i = 0; i < csClasses.length; i ++) {
                            counting.push(csClasses[i].innerText);
                        }

                        // Get all classes credits
                        // while (idx < creditHours.length) {
                        //     creditData.push(creditHours[idx].innerText);
                        //     idx += 8;
                        // }

                        for (var i = 0; i < elements.length; i++) {
                            // var index = 0;
                            var staff = {};
                            // var credit = '';
                            let courseName = elements[i].innerText;
                            let classSectionVal = classNumber(courseName);
                            let sectionNum = sectionLetter(courseName);
                            let CRN = crnNumber(courseName);
                            staff = {
                                "description": courseName,
                                "courseName": classSectionVal,
                                "section": sectionNum,
                                "crn": CRN,
                            };

                            // Appending staff data to object
                            if (counting[i]) {
                                Object.assign(staff, scheduleData(counting[i]));
                            }
                            nested.push(staff);
                            dataOut[major] = nested;
                        }
                        // dataOut[major] = creditData;
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

        // Write json file to txt
        fs.writeFile("text.txt", "", () => { });
        fs.writeFile("errorKey.txt", "", () => { });
        fs.writeFile("error.txt", "", () => { });
        fs.writeFile("subjects.txt", "", () => { });
        var i = 1;
        for (key in result) {
            console.log(key);
            console.log(i);
            fs.appendFile("subjects.txt", key + ',', () => {});
            var response = await getMajor(key);
            if (!response.success) {
                fs.appendFile("errorKey.txt", response.data, () => { });
                fs.appendFile("errorKey.txt", response.data[0], () => { });
                fs.appendFile("error.txt", JSON.stringify(response.data[1]), () => { })
            }
            else {
                fs.appendFile("text.txt", JSON.stringify(response.data, null, 4), () => { });
                if (i != Object.keys(result).length) {
                    fs.appendFile("text.txt", ',', () => { });
                } else if (i === Object.keys(result).length) {
                    console.log("****FINISH CRAWLING DATA****");
                    process.exit(0);
                }
            }
            i ++;
        }
    };

// Visual data
  scrape().then((value) => {
    console.log(value);
});
}
crawlSubjects()

module.exports = {
    crawlSubjects
}
