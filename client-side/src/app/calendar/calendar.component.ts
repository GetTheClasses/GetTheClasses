import { element } from 'protractor';
// import { InputComponent } from './../input/input.component';
import { Component, OnInit   } from '@angular/core';
import { $$ } from '../../../node_modules/protractor';
// import * as $ from 'jquery';
// import 'fullcalendar';
// import 'fullcalendar-scheduler';

declare var $: any;
declare var moment: any;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

	constructor() {}

	courseSelected: any;
	eventsData: any[] = [];
	timeRanges = {};

	calendarFormat() {
		console.log(this.eventsData);
		$('#calendar').fullCalendar({
			header: false,
			defaultView: "agendaWeek",
			allDaySlot: false,
			hiddenDays: [0, 6],
			aspectRatio: 1.742,
			// scrollTime: '00:00',
			columnHeaderFormat: "dddd",
			minTime: '08:00:00',
			maxTime: '21:00:00',
			selectable: true,
			// selectHelper: true,
			// slotEventOverlap: true,
			// editable: true,
			// unselectAuto: false,
			snapDuration: '00:05:00',
			defaultDate: '2018-08-20',
			dayClick: (date, jsEvent, view) => {
				alert('Clicked on: ' + date.format());
				// console.log(date);
				// var start = moment("08:00", "hh:mm");
				// // start.day(date.day());
				// var end = moment("21:00", "hh:mm");
				// // end.day(date.day());
				// console.log(start);
				// console.log(end);
			},
			// eventClick: (event, element) => {
			// 	$('#calendar').fullcalendar('updateEvent', event);
			// }
			// events: this.eventsData
			// events: [
			// 	{
			// 		title: 'Thinh',
			// 	  	start: '2018-08-20T10:00:00',
			// 	  	end: '2018-08-20T16:00:00',
			// 		color: 'green',
			// 		borderColor: 'black',
			// 		textColor: 'white',
			// 		editable: true
			// 	}
			// ],
			select: (start, end, jsEvent, view) => {
				console.log(moment(start).format('HH:mm'));
				console.log(moment(end).format('HH:mm'));
				console.log(jsEvent.target);
				// $("#calendar").fullCalendar('addEventSource', [{
				// 	start: '2018-08-20T10:00:00',
				// 	end: '2018-08-20T12:00:00',
				// 	block: true,
				// }])
			},
		});
	}

	// testing() {
	// 	$('#calendar').fullCalendar({
	// 		viewRender: function(view) {
	// 			$('#calendar').fullCalendar('addEventSource', this.eventsData[0]);
	// 		}
	// 	})
	// }

  ngOnInit() {
	this.calendarFormat();
}

recieveMess($event) {
	console.log($event);
	this.timeRanges = {
		'start': [],
		'end': []
	};
	var timeData = $event.time.split('|');
	for (var ele of timeData) {
		this.analyzeDate(ele);
	}
	console.log(this.timeRanges);
	this.eventsData = [];
	var randomColor = this.getRandomColor();
	for (var i = 0; i < this.timeRanges['start'].length; i++) {
		this.eventsData.push({
			title: $event.name + '  Professor: ' + $event.professor,
			start: this.timeRanges['start'][i],
			end: this.timeRanges['end'][i],
			borderColor: 'black',
			textColor: 'white',
			color: randomColor,
			editable: true,
			overlap: false,
		})
	}
	console.log(this.eventsData);
	for (var ele of this.eventsData) {
		$("#calendar").fullCalendar('addEventSource', [ele])
	}
}

getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

analyzetimeStart(str) {
	var time = str.slice(str.indexOf('-') + 1, str.indexOf('-') + 7);
	return time.trim() + ':00'
}

analyzetimeEnd(str) {
	var time = str.slice(str.length - 6, str.length);
	return time.trim() + ':00'
}


analyzeDate(str) {
	var date = {
		'M': '2018-08-20',
		'T': '2018-08-21',
		'W': '2018-08-22',
		'Th': '2018-08-23',
		'F': '2018-08-24'
	}
	var timeRange = str.slice(0, str.indexOf('-') - 1).trim();
	for (var i = 0; i < timeRange.length; i++) {
		var currDate = timeRange[i];
		var dateFormat = date[currDate];
		var timeStart = this.analyzetimeStart(str);
		var timeEnd = this.analyzetimeEnd(str);
		this.timeRanges['start'].push(dateFormat + 'T' + timeStart);
		this.timeRanges['end'].push(dateFormat + 'T' + timeEnd)
	}
}

}
