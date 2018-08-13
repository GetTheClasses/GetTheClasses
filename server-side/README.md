# GetTheClasses
## Install and run:
To run seperate file:
```
node <filename>
```

To run app.js after every save:
```
npm run dev
```

Run setting for the database:
```
npm run db
```

__NOTE__: If your 

## List of API call: ##
<ins>POST _/api/ping_:<ins> pings heroku server to keep alive (send dummy request).

<u>GET _/api/course_:</u> Run algorithm to get the classes' combinations in the desired time.

<ins>GET _/api/classDetailInfo_:<ins> Get class detail information using **crn**.

**GET _/api/classGeneralInfo_:** Get class general information using **major**, **courseNumber**, and **crn** (yes I know it does not make sense but... it works).

**GET _/api/courseDetailInfo_:** Get all sections detail information using _major_ and **courseNumber**.

**GET _/api/courseGeneralInfo_:** Get all sections general information using **major** and **courseNumber**.

**GET _/api/getAllMajorsName_:** Get all majors' name (82 of them).

**GET _/api/getAllMajorsAndCourseNumbers_:** Get all availabe majors offer at Tech along with their course numbers.

**GET _/api/getSpecificMajorCourseNumbers_:** Get all course number of a major at Tech using **major**.
