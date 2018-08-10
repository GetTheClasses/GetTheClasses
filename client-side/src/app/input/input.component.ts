import { Component, OnInit, Output, ChangeDetectionStrategy, EventEmitter, ChangeDetectorRef, Input } from '@angular/core';
import { Criteria } from '../models/criteria';
import { HttpMethodService } from '../http-method.service';
import { CourseCriteria } from '../models/courseCriteria';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TransferDataService } from '../services/transfer-data.service';

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

    subject: string[] = ['--', 'ACCT', 'AE', 'APPH', 'ARBC', 'ARCH', 'AS', 'ASE', 'BCP', 'BMED'];
    filteredsubject: any[];
    eventClicked: boolean = false;
    subjectChoose: string;
    subjectSelected: string = '';
    constructor(private methodHelper: HttpMethodService,
      private transferDataService: TransferDataService) { }

    private result: any[] = [];
    private criteria: Criteria[] = [];
    private major: string;
    private courseNumber: string;
    private timeSchedule;

    classDetails: string[] = ['ACCT 2101', 'ACCT 2102'];
    filteredClassDetails: any[];
    classChoose: string;
    classSelected: string = '';
    classClicked: boolean = false;

    sectionDetails: string[] = ['ACCT 2101 - A'];

  // Filter function for autocomplete search
  filterSearch(event) {
    this.filteredsubject = [];
    for (let i = 0; i < this.subject.length; i++) {
      let subjectChoose = this.subject[i];
      if (subjectChoose.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        this.filteredsubject.push(subjectChoose);
      }
    }
  }

  // Capture the selected subject
  captureId($event) {
    this.subjectSelected = $event;
    if ($event != '' && $event != '--') {
      this.eventClicked = true;
    } else if ($event == '--') {
      this.eventClicked = false;
    }
  }

  filterClassSearch(event) {
    this.filteredClassDetails = [];
    for (let i = 0; i < this.classDetails.length; i++) {
      let classChoose = this.classDetails[i];
      if (classChoose.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
        this.filteredClassDetails.push(classChoose);
      }
    }
  }

  captureClass($event) {
    this.classSelected = $event;
    this.classClicked = true;
  }

  // onCourseClicked() {

  // }

// Test

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
// cities3 = this.cities.slice();
// cities4 = this.cities.slice();

// selectedCity = this.cities[0].name;
// selectedCity2 = this.cities2[1].name;
selectedCourse = 'Quick Add';
// selectedCity3 = "Select Section";

// people = [];
// selectedPeople = [];
// serverSideFilterItems = [];

// peopleTypeahead = new EventEmitter<string>();

// selectAll() {
//     this.selectedPeople = this.people.map(x => x.name);
// }

// unselectAll() {
//     this.selectedPeople = [];
// }

onCourseSelect($event) {
  this.courseClicked.emit($event);
}

  getMajor(event: any): void {
    this.major = event.target.value;
  }

  getCourseNumber(event: any): void {
    this.courseNumber = event.target.value;
  }

  clear(): void {
    this.criteria = [];
    console.log(this.criteria);
  }

  save(): void {
    this.criteria.push({
      major: this.major,
      courseNumber: this.courseNumber
    });
    console.log(this.criteria);
  }

  getClasses() {
    this.timeSchedule = this.transferDataService.getFreeTime();
    this.methodHelper.post('http://localhost:8000/api/course', {
      criteria: this.criteria,
      freeTime: this.timeSchedule
    })
      .subscribe((data) => {
        console.log(data);
      });
  }
}
