import { Component, OnInit } from '@angular/core';

declare var $: any;
declare var moment: any;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  	$('#calendar').fullCalendar({
  		header: false,
  		defaultView: "agendaWeek",
  		hiddenDays: [0],
  		columnHeaderFormat: "dddd",
  		minTime: '08:00:00',
  		maxTime: '21:00:00',
  		selectable: true,
  		selectHelper: true,
  		editable: true,
  		unselectAuto: false,
  		snapDuration: '00:05:00',
  		select: function (start, end, jsEvent, view) {
		    console.log(moment(start).format('HH:mm'));
		    console.log(moment(end).format('HH:mm'));
		    console.log(jsEvent.target);
		}
  	});
  }

}
