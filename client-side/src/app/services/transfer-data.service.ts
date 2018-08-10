import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransferDataService {

  constructor() { }
  private freeTime;
  private courseCriteria;

  setCourse(data): void {
  	this.courseCriteria = data;
  }

  getCourses(): any {
  	return this.courseCriteria;
  }

  setFreeTime(data): void {
  	this.freeTime = data;
  }

  getFreeTime(): any {
  	return this.freeTime;
  }
}
