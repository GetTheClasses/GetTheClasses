import { Injectable } from '@angular/core';

declare var $: any;
declare var moment: any;

@Injectable({
  providedIn: 'root'
})
export class CalendarHelperService {

  constructor() { }

  isValidTime(start, end): boolean {
  	if ((end.hours() - start.hours()) * 60 + end.minutes() - start.minutes() < 45) {
  		return false
  	}
  	return true;
  }

  scheduleTimeFormat(events): any {
  	var dictTime = { m: [], t: [], w: [], r: [], f: [], s: []};
  	var stringTime = [];
  	for (var e of events) {
			if ((moment(e.start).format('dd')) == "Th") {
				var period = "r" + e.start.format("HHmm") + e.end.format("HHmm");
			}
			else {
				var period = ("" + e.start.format("dd")[0]).toLowerCase() + e.start.format("HHmm") + e.end.format("HHmm");
			}
			stringTime.push(period);
  	}
  	stringTime.sort();
		for (var time of stringTime) {
			dictTime[time[0]]
			.push([parseInt(time.substring(1,5)), 
				parseInt(time.substring(5, time.length))]);
		}
		return dictTime;
  }
}
