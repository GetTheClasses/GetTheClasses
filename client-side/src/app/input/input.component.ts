import { Component, OnInit } from '@angular/core';
import { Criteria } from '../models/criteria';
import { HttpMethodService } from '../http-method.service';
import { CourseCriteria } from '../models/courseCriteria';
import { TransferDataService } from '../services/transfer-data.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css']
})
export class InputComponent {
  constructor(private methodHelper: HttpMethodService,
    private transferDataService: TransferDataService) { }

  private result: any[] = [];
  private criteria: Criteria[] = [];
  private major: string;
  private courseNumber: string;
  private timeSchedule;

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

  submit(): void {
    this.methodHelper.post('http://localhost:8000/api/course', this.criteria)
      .subscribe((data) => {
        console.log(data);
        //if (data.success) {
        //  this.result.push(data.result);
        //}
      });
  }

  getClasses() {
    this.timeSchedule = this.transferDataService.getData();
    console.log(this.timeSchedule);
    this.methodHelper.post('http://localhost:8000/api/course', {
      criteria: this.criteria,
      freeTime: this.timeSchedule
    })
      .subscribe((data) => {
        console.log(data);
        //if (data.success) {
        //  this.result.push(data.result);
        //}
      });
  }
}
