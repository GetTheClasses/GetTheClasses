import { Component, OnInit } from '@angular/core';
import { TransferDataService } from '../services/transfer-data.service';

declare var $: any;
declare var moment: any;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  constructor(private transferDataService: TransferDataService) { }

  ngOnInit() {
  	$('#calendar').fullCalendar({
  		aspectRadio: 1,
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
  		aspectRatio: 1.1,
  		contentHeight: "auto",
  		// eventColor: "red",
			select: function (start, end, jsEvent, view) {
			    $("#calendar").fullCalendar('addEventSource', [{
			        start: start,
			        end: end,
			        block: true
			    }]);
			},
			selectOverlap: function(event) {
			    return ! event.block;
			},
			eventRender: function(event, element, view) {
        if (view.name == 'listDay') {
            element.find(".fc-list-item-time").append("<span class='closeon'>X</span>");
        } else {
            element.find(".fc-content").prepend("<span class='closeon'>X</span>");
        }
        element.find(".closeon").on('click', function() {
          $('#calendar').fullCalendar('removeEvents',event._id);
          console.log('delete');
        });
	    }	
	  });

  	$("#button").click(() => {
  		$('#calendar').fullCalendar('refetchEvents');
  		var events = $('#calendar').fullCalendar('clientEvents');
  		var stringTime = [];
  		var dictTime = {
  			m: [],
  			t: [],
  			w: [],
  			r: [],
  			f: [],
  			s: []
  		};
  		for (var e of events) {
  			if ((moment(e.start).format('dd')) == "Th") {
  				var period = "r" + moment(e.start).format("HHmm") + moment(e.end).format("HHmm");
  			}
  			else {
  				var period = ("" + moment(e.start).format("dd")[0]).toLowerCase() + moment(e.start).format("HHmm") + moment(e.end).format("HHmm");
  			}
  			stringTime.push(period);
  		}
  		stringTime.sort();
  		for (var time of stringTime) {
  			dictTime[time[0]].push(
  				[parseInt(time.substring(1,5)), parseInt(time.substring(5, time.length))]
  				);
  		}
  		console.log("Time Saved.")
  		this.transferDataService.setData(dictTime);
  	});

  	$('#button1').click(function() {
  		var start = moment("Mo, 12:20", "dd, HH:mm");
  		var end = moment("Mo, 14:50", "dd, HH:mm");
  		$('#calendar').fullCalendar('renderEvent', {
  			title: "CS 2050",
  			start: start,
  			end: end
  		})
  	})
  }
}
