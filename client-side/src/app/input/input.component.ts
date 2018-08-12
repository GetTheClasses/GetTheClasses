import { Component, OnInit, Output, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';
import { Criteria } from '../models/criteria';
import { HttpMethodService } from '../http-method.service';
import { CourseCriteria } from '../models/courseCriteria';
import { TransferDataService } from '../services/transfer-data.service';
import { FormControl } from '@angular/forms'
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';

export interface Course {
	name: string;
	courseNum: string;
}
@Component({
	selector: 'app-input',
	templateUrl: './input.component.html',
	styleUrls: [
					'./input.component.css',
					"../../../node_modules/primeng/resources/themes/bootstrap/theme.css"
	]
})
export class InputComponent {
	@Output() courseClicked: EventEmitter<any> = new EventEmitter();

		defaultCourses = ['1355', '2010', '1365'];
		subjects: string[] = ['--', 'ACCT', 'AE','AS', 'APPH', 'ASE', 'ARBC', 'ARCH', 'BIOL', 'BMEJ', 'BMED', 'BCP'];
		terms = ['Fall 2018', 'Summer 2018', 'Spring 2018', 'Fall 2017', 'Summer 2017', 'Spring 2017'];
		position = new FormControl(this.terms[0]);
		filteredsubject: any[];
		eventClicked: boolean = false;
		subjectChoose: string;
		// subjectSelected: string = '';
		dataReturned: any;
		checked1: boolean = true;
		TERM: string = '';
		SUBJECT: string = '';
		COURSE: string = '';
		selectedValue: string = '';
		outputLength: number;

		constructor(private methodHelper: HttpMethodService,
			private transferDataService: TransferDataService) { }

		private result: any[] = [];
		private criteria: Criteria[] = [];
		private major: string;
		private courseNumber: string;
		private timeSchedule;

		// classDetails: string[] = ['ACCT 2101', 'ACCT 2102'];
		filteredClassDetails: any[];
		classChoose: string;
		classSelected: string = '';
		classClicked: boolean = false;

		// sectionDetails: string[] = ['ACCT 2101 - A'];

	// Filter function for autocomplete search
	// filterSearch(event) {
	// 	this.filteredsubject = [];
	// 	for (let i = 0; i < this.subject.length; i++) {
	// 		let subjectChoose = this.subject[i];
	// 		if (subjectChoose.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
	// 			this.filteredsubject.push(subjectChoose);
	// 		}
	// 	}
	// }

	// Capture the selected subject
	// captureId($event) {
	// 	// this.subjectSelected = $event;
	// 	if ($event != '' && $event != '--') {
	// 		this.eventClicked = true;
	// 	} else if ($event == '--') {
	// 		this.eventClicked = false;
	// 	}
	// }

	// filterClassSearch(event) {
	// 	this.filteredClassDetails = [];
	// 	for (let i = 0; i < this.classDetails.length; i++) {
	// 		let classChoose = this.classDetails[i];
	// 		if (classChoose.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
	// 			this.filteredClassDetails.push(classChoose);
	// 		}
	// 	}
	// }

	// captureClass($event) {
	// 	this.classSelected = $event;
	// 	this.classClicked = true;
	// }

	cities = [
		{id: 1, name: ' AE 1355 - MAV', professor: '', time: 'TR|18002045|T|16301720', avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x'},
		{id: 2, name: ' AE 1601 - A', professor: '', time: 'TR|0900045', avatar: '//www.gravatar.com/avatar/ddac2aa63ce82315b513be9dc93336e5?d=retro&r=g&s=15'},
		{id: 3, name: ' AE 1601 - B', professor: '', time: 'TR|12001315', avatar: '//www.gravatar.com/avatar/6acb7abf486516ab7fb0a6efa372042b?d=retro&r=g&s=15'},
		{id: 4, name: ' AE 1601 - C', professor: '', time: 'MW|15001615', avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x'},
		{id: 5, name: ' AE 2010 - A', professor: '', time: 'MWF|09051015', avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x'},
		{id: 6, name: ' AE 2010 - B', professor: '', time: 'MW|13551535', avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x'},
		{id: 7, name: ' AE 2010 - R', professor: '', time: 'TWR|11001225', avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x'},
	];

	courseList = this.cities.slice();
	selectedCourse = 'Quick Add';

	onCourseSelect($event) {
		this.courseClicked.emit($event);
	}

	// CHIPS FUNC
	visible = true;
	selectable = true;
	removable = true;
	courses: Criteria[] = this.criteria;

	remove(course: Criteria): void {
		const index = this.courses.indexOf(course);
		if (index >= 0) {
			this.defaultCourses.push(course.courseNumber);
			this.courses.splice(index, 1);
		}
		this.defaultCourses.sort();
	}

	// HTTP GETs
	// One for fetching terms

	// One for fetching Subject list of the terms

	// One for fetching course list base on subject of the term


	// LIFE CYCLE
	ngOnInit() {
		this.TERM = this.position.value;
	}

	// METHODS
	deleteAll() {
		for (var i = 0; i < this.courses.length; i++) {
			this.defaultCourses.push(this.courses[i].courseNumber);
		}
		this.defaultCourses.sort();
		this.criteria = [];
		this.courses = this.criteria;
		this.outputLength = 0;
	}

	termSelected(term: string) {
		console.log(term);
		this.TERM = term;
	}

	subjectSelected(subject: string) {
		console.log(subject);
		if (subject == '' || subject == '--') {
			this.SUBJECT = '';
		} else {
			this.SUBJECT = subject;
		}
	}

	courseSelected(course: string) {
		if (course != '') {
			this.COURSE = course;
			this.criteria.push({
				major: this.SUBJECT,
				courseNumber: course
			});
			var eleIndx = this.defaultCourses.indexOf(course);
			this.defaultCourses.splice(eleIndx, 1);
		}
		console.log(this.criteria);
	}

	getClasses() {
		this.timeSchedule = this.transferDataService.getFreeTime();
		console.log(this.criteria);
		this.methodHelper.post(environment.HOST + '/api/course', {
			criteria: this.criteria,
			freeTime: this.timeSchedule
		})
		.subscribe((data) => {
			console.log(data);
			if (data.success) {
				this.dataReturned = data.result;
				this.outputLength = this.dataReturned.length;
			} else {
				this.dataReturned = [];
				this.outputLength = 0;
			}
		});
	}

	sample() {
    this.methodHelper.get(environment.HOST + '/api/classDetailInfo/?crn=82849')
    .subscribe((data) => {
      console.log("Class Detail: ");
      console.log(data);
    });
    this.methodHelper.get(environment.HOST + '/api/classGeneralInfo/?major=CS&courseNumber=1331&crn=82849')
    .subscribe((data) => {
      console.log("Class General: ");
      console.log(data);
    });
    this.methodHelper.get(environment.HOST + '/api/courseDetailInfo/?major=CS&courseNumber=1331')
    .subscribe((data) => {
      console.log("Course Detail: ");
      console.log(data);
    });
    this.methodHelper.get(environment.HOST + '/api/courseGeneralInfo/?major=CS&courseNumber=1331')
    .subscribe((data) => {
      console.log("Course General: ");
      console.log(data);
    });
    this.methodHelper.get(environment.HOST + '/api/getAllMajorsName')
    .subscribe((data) => {
      console.log("getAllMajorsName: ");
      console.log(data);
    });
    this.methodHelper.get(environment.HOST + '/api/getAllMajorsAndCourseNumbers')
    .subscribe((data) => {
      console.log("getAllMajorsAndCourseNumbers: ");
      console.log(data);
    });
    this.methodHelper.get(environment.HOST + '/api/getSpecificMajorCourseNumbers/?major=CS')
    .subscribe((data) => {
      console.log("getSpecificMajorCourseNumbers: ");
      console.log(data);
    });
  }
}
