import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { Criteria } from '../models/criteria';
import { HttpMethodService } from '../http-method.service';
import { CourseCriteria } from '../models/courseCriteria';
import { TransferDataService } from '../services/transfer-data.service';
import { FormControl } from '@angular/forms'
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { runInThisContext } from 'vm';

declare var $: any;
declare var moment: any;

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
export class InputComponent implements OnInit {
	@Output() courseClicked: EventEmitter<any> = new EventEmitter();
	@Input() userID: string;

	// sections = [];
	defaultCourses = [];
	coursePosition = new FormControl(this.defaultCourses[0]);
	subjects: string[] = ['--'];
	// terms = ['Fall 2018', 'Summer 2018', 'Spring 2018', 'Fall 2017', 'Summer 2017', 'Spring 2017'];
	terms = ['Fall 2018'];
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
	section: string = '';
	CRN: string = '';
	selectedValue: string = '';
	outputLength: number;
	viewDetails: boolean = false;
	presentData = [];
	testing = {};
	saveSubjects = {};
	sectionsData = [];
	crnsList = [];
	keysListOption = [];
	optionSelectedObject = {};
	// AutoComplete
	filteredOptions: Observable<string[]>;
	subjectAutoComplete = new FormControl();
	courseFilter: Observable<string[]>;
	courseAutoComplete = new FormControl();
	typesOfShoes: string[] = ['Option 1'];
	randomID = 3;
	otherDataReturn = [];

	constructor(private methodHelper: HttpMethodService, private transferDataService: TransferDataService) { }

	private result: any[] = [];
	private criteria: Criteria[] = [];
	private major: string;
	private courseNumber: string;
	private timeSchedule;

	filteredClassDetails: any[];
	classChoose: string;
	classSelected: string = '';
	classClicked: boolean = false;

	// cities = [
	// 	{id: 1, name: ' AE 1355 - MAV', professor: '', time: 'TR|18002045|T|16301720', avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x'},
	// 	{id: 2, name: ' AE 1601 - A', professor: '', time: 'TR|0900045', avatar: '//www.gravatar.com/avatar/ddac2aa63ce82315b513be9dc93336e5?d=retro&r=g&s=15'},
	// 	{id: 3, name: ' AE 1601 - B', professor: '', time: 'TR|12001315', avatar: '//www.gravatar.com/avatar/6acb7abf486516ab7fb0a6efa372042b?d=retro&r=g&s=15'},
	// 	{id: 4, name: ' AE 1601 - C', professor: '', time: 'MW|15001615', avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x'},
	// 	{id: 5, name: ' AE 2010 - A', professor: '', time: 'MWF|09051015', avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x'},
	// 	{id: 6, name: ' AE 2010 - B', professor: '', time: 'MW|13551535', avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x'},
	// 	{id: 7, name: ' AE 2010 - R', professor: '', time: 'TWR|11001225', avatar: '//www.gravatar.com/avatar/b0d8c6e5ea589e6fc3d3e08afb1873bb?d=retro&r=g&s=30 2x'},
	// ];

	// courseList = this.cities.slice();
	selectedCourse = 'Quick Add Class';

	onCourseSelect($event) {
		this.selectedCourse = 'Quick Add';
		var dataSend = [$event];
		dataSend["on/off"] = 1;
		dataSend["privateID"] = this.randomID;
		this.randomID += 3;
		console.log(dataSend);
		this.courseClicked.emit(dataSend);
	}

	// CHIPS FUNC
	visible = true;
	selectable = true;
	removable = true;
	courses: Criteria[] = this.criteria;

	remove(course: Criteria): void {
		const index = this.courses.indexOf(course);
		if (index >= 0) {
			// this.defaultCourses.push(course.courseNumber);
			this.courses.splice(index, 1);
			this.outputLength --;
		}
		console.log(course.sectionVal.split(' - '));
		const sectionIndex = this.crnsList.indexOf(course.sectionVal.split(' - ')[2]);
		console.log(sectionIndex);
		if (sectionIndex >= 0) {
			this.crnsList.splice(sectionIndex, 1);
		}
		this.defaultCourses.sort();
		this.coursePosition = new FormControl(this.subjects[0]);
	}

	// LIFE CYCLE
	ngOnInit() {
		this.TERM = this.position.value;
	    this.methodHelper.get(environment.HOST + '/api/getAllMajorsName')
	    .subscribe((data) => {
	      data.unshift('--')
		  this.subjects = data;

		 	 // Auto complete for Subject
			this.filteredOptions = this.subjectAutoComplete.valueChanges
			.pipe(
				startWith(''),
				map(value => this._subjectFilter(value))
			);
		});

		// Hover view on dropdown event
		$("dropdownSelect").on("mouseenter", "card-body", function() {
			// $(this).find(".dropdown").show();
			// console.log("work");
		})
	}

	private _subjectFilter(value: string): string[] {
		const filterValue = value.toLowerCase();
		// console.log(this.subjects);
		return this.subjects.filter(option => option.toLowerCase().includes(filterValue));
	  }

	// METHODS
	deleteAll() {
		for (var i = 0; i < this.courses.length; i++) {
			this.defaultCourses.push(this.courses[i].courseNumber);
		}
		this.defaultCourses.sort();
		this.criteria = [];
		this.crnsList = [];
		this.courses = this.criteria;
		// this.outputLength = 0;
		this.COURSE = '';
		this.coursePosition = new FormControl(this.subjects[0]);
		this.outputLength = -1;
	}

	termSelected(term: string) {
		console.log(term);
		this.TERM = term;
	}

	// Subject Autocomplete data binding
	keySubjectSelected(event) {
		console.log(event.target.value);
		if (event.code == "Enter") {
			this.subjectSelected(event.target.value);
		}
	}

	subjectClicked(event) {
		this.subjectSelected(event.target.innerText.trim());
	}

	subjectSelected(subject: string) {
		console.log(subject);
		if (subject == '' || subject == '--') {
			this.SUBJECT = '';
			this.COURSE = '--';
			this.defaultCourses = [];
		} else {
			this.SUBJECT = subject;
			this.COURSE = '--';
			if (this.saveSubjects[subject] == undefined) {
				this.methodHelper.get(environment.HOST + '/api/getSpecificMajorCourseNumbers/?major=' + subject)
				.subscribe((data) => {
					data.unshift('--')
					this.saveSubjects[subject] = data;
					this.defaultCourses = data;
					this.autoComCouse();
				});
			}
			else {
				this.defaultCourses = this.saveSubjects[subject]
				console.log(this.defaultCourses);
			}
		}
	}

	// Subject Autocomplete data binding
	keyCourseSelected(event) {
		console.log(event.target.value);
		if (event.code == "Enter") {
			this.courseSelected(event.target.value);
		}
	}

	courseSelectClicked(event) {
		this.courseSelected(event.target.innerText.trim());
	}

	// Auto complete for Course
	autoComCouse() {
		this.courseFilter = this.courseAutoComplete.valueChanges
		.pipe(
			startWith(''),
			map(value => this._courseFilterOption(value))
		);
	}

	private _courseFilterOption(value: string): string[] {
		const filterValue = value.toLowerCase();
		return this.defaultCourses.filter(option => option.toLowerCase().includes(filterValue));
	}

	courseSelected(course: string) {
		this.COURSE = course;
		if (course != '' && course != '--') {
			var temp = {
				major: this.SUBJECT,
				courseNumber: course,
				sectionVal: ''
			}
			var hasCourse = false;
			this.criteria.forEach((course) => {
				if (course.major == temp.major
					&& course.courseNumber == temp.courseNumber) {
					hasCourse = true;
				}
			})
			if (!hasCourse) {
				this.criteria.push(temp);
			}
			console.log(this.criteria);
			this.methodHelper.get(environment.HOST + '/api/courseDetailInfo/?major=' + this.SUBJECT +'&courseNumber=' + course)
			.subscribe((data) => {
				this.sectionsData = data;
				console.log(this.crnsList);
			})
			console.log(this.criteria);
		}
	}

	getListOfCRN(object) {
		return object.crn;
	}

	sectionSelected(section: any) {
		this.section = section;
		this.CRN = section.crn;
		var data = section.courseName;
		// console.log(this.CRN);

		// If section selected
		if (this.section != '') {
			var datas = data.split(' ');
			var subj = datas[0];
			var number = datas[1];
			for (var i = 0; i < this.courses.length; i++) {
				if (this.courses[i].major == subj && this.courses[i].courseNumber == number) {
					this.courses.splice(i, 1);
					var temp = {
						major: subj,
						courseNumber: number,
						sectionVal: ' - ' + section.section + ' - ' + this.CRN
					}
					this.courses.push(temp);
					if (!this.crnsList.includes(this.CRN)) {
						this.crnsList.push(this.CRN);
					}
				}
			}
		}
	}

	getClasses() {
		this.dataReturned = [];
		this.otherDataReturn = [];
		this.timeSchedule = this.transferDataService.getFreeTime();
		this.methodHelper.post(environment.HOST + '/api/course', {
			criteria: this.criteria,
			freeTime: this.timeSchedule,
			crnList: this.crnsList
		})
		.subscribe((data) => {
			if (data.success) {
				this.dataReturned = this.resultParse(data);
				this.outputLength = data.result.length;
			} else {
				this.dataReturned = [];
				this.outputLength = 0;
				this.newDataGenerate();
			}
		});
	}

	newDataGenerate() {
		var output = [];
		for (var i = 0; i < this.courses.length; i++) {
			this.methodHelper.get(environment.HOST + '/api/courseDetailInfo/?major=' + this.courses[i].major + '&courseNumber=' + this.courses[i].courseNumber)
			.subscribe((data) => {
				for (var section of data) {
					output.push(section);
				}
			})
		}
		setTimeout(() => {
			this.otherDataReturn = output;
			console.log(this.otherDataReturn);
		}, 300)
	}

	resultParse(data) {
		var datas = data.result;
		var output = [];
		this.keysListOption = [];
		for (var i = 0; i < datas.length; i++) {
			var dict = {};
			var key = "Option " + (i+1);
			this.keysListOption.push(key);
			dict[key] = datas[i];
			output.push(dict);
		}
		return output;
	}

	viewDetailsClicked() {
		this.viewDetails = true;
	}

	onAreaListControlChanged(event) {
		console.log(this.timeSchedule);
		console.log(event);
		if (!this.optionSelectedObject.hasOwnProperty(event)) {
			this.optionSelectedObject[event] = 1;
		} else {
			this.optionSelectedObject[event] += 1;
		}
		var value = this.optionSelectedObject[event];
		var remi = value % 2;
		// Update object
		this.optionSelectedObject[event] = remi;
		console.log(this.optionSelectedObject);
		var objectVal = [];

		// If the key  == 1 => get data from dataReturned => send emit to calendar to update with crn as id number
		console.log(this.dataReturned);
		if (this.optionSelectedObject[event] == 1) {
			for (var ele of this.dataReturned) {
				objectVal = ele[event];
				if (ele[event]) {
					objectVal['on/off'] = 1;
					objectVal['privateID'] = this.randomID;
					var dataSend = objectVal;
					console.log(dataSend);
					this.courseClicked.emit(dataSend);
				}
				this.randomID += 3;
			}
		} else {
			for (var ele of this.dataReturned) {
				objectVal = ele[event];
				if (ele[event]) {
					objectVal['on/off'] = 0;
					var dataSend = objectVal;
					console.log(dataSend);
					this.courseClicked.emit(dataSend);
				}
			}
		}
	}

  	saveUserFreeTime() {
  		var userFreeTime = []
		$('#calendar').fullCalendar('clientEvents').forEach((event) => {
			var temp = {
				start: event.start.day() + '|' + event.start.hours() + event.start.minutes(),
				end: event.end.day() + '|' + event.end.hours() + event.end.minutes()
			}
			userFreeTime.push(temp);
		})
		this.methodHelper.post(environment.HOST + '/api/saveUserFreeTime', {
			userID: this.userID,
			freeTime: userFreeTime
		})
		.subscribe((data) => {
			if (!data.success)
				alert(data.result);
			else
				console.log(data.result);
        });
    }

    test() {
        alert(this.userID);
    }
}
