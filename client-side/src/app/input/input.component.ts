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
	private userFreeTimeEvents = [];

	filteredClassDetails: any[];
	classChoose: string;
	classSelected: string = '';
	classClicked: boolean = false;

	selectedCourse = 'Quick Add Class';

	onCourseSelect($event) {
		this.selectedCourse = 'Quick Add';
		var dataSend = [$event];
		dataSend["on/off"] = 1;
		dataSend["privateID"] = this.randomID;
		this.randomID += 3;
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
			this.courses.splice(index, 1);
			this.outputLength --;
		}
		const sectionIndex = this.crnsList.indexOf(course.sectionVal.split(' - ')[2]);
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
	}

	private _subjectFilter(value: string): string[] {
		const filterValue = value.toLowerCase();
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
		this.COURSE = '';
		this.coursePosition = new FormControl(this.subjects[0]);
		this.outputLength = -1;
	}

	termSelected(term: string) {
		this.TERM = term;
	}

	// Subject Autocomplete data binding
	keySubjectSelected(event) {
		if (event.code == "Enter") {
			this.subjectSelected(event.target.value);
		}
	}

	subjectClicked(event) {
		this.subjectSelected(event.target.innerText.trim());
	}

	subjectSelected(subject: string) {
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
			}
		}
	}

	// Subject Autocomplete data binding
	keyCourseSelected(event) {
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
			this.methodHelper.get(environment.HOST + '/api/courseDetailInfo/?major=' + this.SUBJECT +'&courseNumber=' + course)
			.subscribe((data) => {
				this.sectionsData = data;
			})
		}
	}

	getListOfCRN(object) {
		return object.crn;
	}

	sectionSelected(section: any) {
		this.section = section;
		this.CRN = section.crn;
		var data = section.courseName;

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
		this.userFreeTimeEvents = $('#calendar').fullCalendar('clientEvents');
		this.timeSchedule = this.transferDataService.getFreeTime();
		console.log(this.timeSchedule);
		this.methodHelper.post(environment.HOST + '/api/course', {
			criteria: this.criteria,
			freeTime: this.timeSchedule,
			crnList: this.crnsList
		})
		.subscribe((data) => {
			// this.courseClicked.emit("");
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
		if (!this.optionSelectedObject.hasOwnProperty(event)) {
			this.optionSelectedObject[event] = 1;
		} else {
			this.optionSelectedObject[event] += 1;
		}
		var value = this.optionSelectedObject[event];
		var remi = value % 2;

		// Update object
		this.optionSelectedObject[event] = remi;
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
					this.courseClicked.emit(dataSend);
				}
			}
		}
	}

  	saveUserFreeTime() {
  		var userFreeTime = []
		$('#calendar').fullCalendar('clientEvents').forEach((event) => {
			var temp = {
				start: event.start.format("d|HHmm"),
				end: event.end.format("d|HHmm")
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
        });
    }

    test() {
        alert(this.userID);
	}
	hoverOption(index) {
		var temp = JSON.parse(JSON.stringify(this.dataReturned[index]));
		var item = temp[Object.keys(temp)[0]];
		item['hover'] = true;
		this.courseClicked.emit(item);
		console.log(item);
		// console.log(item[Object.keys(item)[0]])
	}
	displayFreeTime() {
		$('#calendar').fullCalendar('removeEvents');
		setTimeout(() => {
			if ($('#calendar').fullCalendar('clientEvents').length == 0) {
				$('#calendar').fullCalendar('addEventSource', this.userFreeTimeEvents);
			}
		}, 2);
	}
}
