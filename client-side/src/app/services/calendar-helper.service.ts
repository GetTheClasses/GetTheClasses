import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendarHelperService {

  constructor() { };

  isValidTime(start, end): boolean {
  	if ((end.hours() - start.hours()) * 60 + end.minutes() - start.minutes() < 45) {
  		return false
  	}
  	return true;
  }
}
