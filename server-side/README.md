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
<ins>POST _/api/ping_:</ins> pings heroku server to keep alive (send dummy request).

<ins>GET _/api/course_:</ins> Run algorithm to get the classes' combinations in the desired time.

<ins>GET _/api/classDetailInfo_:</ins> Get class detail information using **crn**.

<ins>GET _/api/classGeneralInfo_:</ins> Get class general information using **major**, **courseNumber**, and **crn** (yes I know it does not make sense but... it works).

<ins>GET _/api/courseDetailInfo_:</ins> Get all sections detail information using _major_ and **courseNumber**.

<ins>GET _/api/courseGeneralInfo_:</ins> Get all sections general information using **major** and **courseNumber**.

<ins>GET _/api/getAllMajorsName_:</ins> Get all majors' name (82 of them).

<ins>GET _/api/getAllMajorsAndCourseNumbers_:</ins> Get all availabe majors offer at Tech along with their course numbers.

<ins>GET _/api/getSpecificMajorCourseNumbers_:</ins> Get all course number of a major at Tech using **major**.
