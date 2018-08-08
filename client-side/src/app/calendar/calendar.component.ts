import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TransferDataService } from '../services/transfer-data.service';
import { CalendarHelperService } from '../services/calendar-helper.service';

declare var $: any;
declare var moment: any;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {

  constructor(private transferDataService: TransferDataService,
  	private calendarHelperService: CalendarHelperService) { }

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
  		contentHeight: "auto",
  		eventOverlap: false,
  		// eventColor: "red",
  		eventResize: (event) => {

  			// Handle resize issue here (start-end range is too small)
  			console.log(event.start.format("HH:mm"));
  			console.log(event.end.format("HH:mm"));
  		},
  		selectConstraint: {
  			start: "08:00",
  			end: "22:00"
  		},
			select: (start, end) => {
				console.log(123);
				if (!this.calendarHelperService.isValidTime(start, end)) {
					end = start.clone().add(45, 'm');
				}
				$('#calendar').fullCalendar('unselect');
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
            element.find(".fc-list-item-time").append("<button class='closeon'>X</button>")
        } else {
            element.find(".fc-content").prepend("<button class='closeon'>X</button>")
        }
        element.find(".closeon").on('click', function() {
          $('#calendar').fullCalendar('removeEvents',event._id);
          console.log('delete');
        });
  			var events = $('#calendar').fullCalendar('clientEvents');
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
  				var period = "r" + e.start.format("HHmm") + e.end.format("HHmm");
  			}
  			else {
  				var period = ("" + e.start.format("dd")[0]).toLowerCase() + e.start.format("HHmm") + e.end.format("HHmm");
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
  		console.log(dictTime);
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
