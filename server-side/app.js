const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const main = require('./scripts/getClasses');
const getInfo = require('./scripts/getInfo');
const authentication = require('./scripts/authentication');
require('dotenv').config();

app.use(bodyParser.json());
app.use(cors());

app.listen(process.env.PORT || 8000, () => {
    console.log('Listening on port', process.env.PORT || 8000);
});

app.get('/api/ping', (req, res) => {
    console.log('PING PING PING!!!\n');
    res.send("Awake");
});

app.route('/api/course').post((req, res) => {
    console.log(req.body);
    console.log("Recieved call to api/course")
    if (req.body.freeTime == undefined)
        req.body.freeTime = null;

    main(req.body.criteria, req.body.freeTime, req.body.crnList).then((data) => {
        if (data.length > 0 && data[0].length == 0)
            data.splice(0,1);
        if (data.length > 0 && data[0].length > 0) {
            res.send({
                success: true,
                result: data
            });
        }
        else {
            res.send({
                success: false,
                result: "No match schedule."
            })
        }
        console.log("Returned data from api/course\n")
    });
});

app.get('/api/classDetailInfo', (req, res) => {
    console.log("Recieved call to api/classDetailInfo")
    getInfo.getClassDetailWithCrn(req.query.crn).then((result) => {
        res.send(result);
        console.log("Returned data from api/classDetailInfo\n")
    });
});

app.get('/api/classGeneralInfo', (req, res) => {
    console.log("Recieved call to api/classGeneralInfo")
    var query = req.query,
        major = query.major,
        courseNumber = query.courseNumber,
        crn = query.crn;
    getInfo.getClassGeneral(major, courseNumber, crn)
    .then((result) => {
        res.send(result);
        console.log("Returned data from api/classGeneralInfo\n")
    });
});

app.get('/api/courseDetailInfo', (req, res) => {
    console.log("Recieved call to api/courseDetailInfo")
    var query = req.query,
        major = query.major,
        courseNumber = query.courseNumber;
    getInfo.getCourseDetail(major, courseNumber).then((data) => {
        res.send(data);
        console.log("Returned data from api/courseDetailInfo\n")
    }); 
});

app.get('/api/courseGeneralInfo', (req, res) => {
    console.log("Recieved call to api/courseGeneralInfo")
    var query = req.query,
        major = query.major,
        courseNumber = query.courseNumber;
    getInfo.getCourseGeneral(major, courseNumber).then((data) => {
        res.send(data);
        console.log("Returned data from api/courseGeneralInfo\n")
    }); 
});

app.get('/api/getAllMajorsName', (req, res) => {
    console.log("Recieved call to api/getAllMajorsName")
    getInfo.getAllMajorsName().then((result) => {
        res.send(result);
        console.log("Returned data from api/getAllMajorsName\n")
    });
});

app.get('/api/getAllMajorsAndCourseNumbers', (req, res) => {
    console.log("Recieved call to api/getAllMajorsAndCourseNumbers")
    getInfo.getAllMajorsAndCourseNumbers().then((result) => {
        res.send(result);
        console.log("Returned data from api/getAllMajorsAndCourseNumbers\n")
    });
});

app.get('/api/getSpecificMajorCourseNumbers', (req, res) => {
    console.log("Recieved call to api/getSpecificMajorCourseNumbers")
    getInfo.getSpecificMajorCourseNumbers(req.query.major).then((result) => {
        res.send(result);
        console.log("Returned data from api/getSpecificMajorCourseNumbers\n")
    });
});

app.post('/api/saveUserFreeTime', (req,res) => {
    console.log("Received call to api/saveUserFreeTime");
    if (req.body.userID != undefined && req.body.userID != "") {
        require('./firebase/saveUserFreeTime')(req.body.userID, req.body.freeTime);
        res.send({
            success: true,
            result: "Data saved."
        });
    }
    else {
        res.send({
            success: false,
            result: "You have to login first to save."
        });
    }
    console.log("Returned data from api/saveUserFreeTime\n")
});

app.post('/api/login', (req, res) => {
    console.log("Recieved call to api/login")
    authentication.signin(req.body.email, req.body.password)
    .then((result) => {
        res.send(result);
        console.log("Returned data from api/login\n")
    });
});

app.post('/api/signup', (req, res) => {
    console.log("Recieved call to api/signup");
    authentication.signup(req.body.email, req.body.password)
    .then((result) => {
        res.send(result);
        console.log("Returned data from api/signup\n");
    });
});

app.post('/api/resetPassword', (req, res) => {
    console.log("Received call to api/resetPassword");
    authentication.resetPassword(req.body.email).then((result) => {
        res.send(result);
        console.log("Returned data from api/resetPassword\n")
    })
})

app.get('/api/fetchDataOfUser', (req, res) => {
    console.log("Received call to api/fetchDataOfUser");
    try {
        if (req.query.userID == undefined || req.query.userID.length < 10)
            throw "Invalid";
        getInfo.fetchDataOfUser(req.query.userID).then(result => {
            res.send(result);
        });
    }
    catch (err) {
        res.send({success: false})
    }
    console.log("Returned data from api/fetchDataOfUser\n")
});