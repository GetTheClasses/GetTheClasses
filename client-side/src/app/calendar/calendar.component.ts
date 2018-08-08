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
  dictTime = { m: [], t: [], w: [], r: [], f: [], s: [] };

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
  			end: "21:00"
  		},
			select: (start, end) => {
				if (!this.calendarHelperService.isValidTime(start, end)) {
					end = start.clone().add(45, 'm');
          for (var e of $('#calendar').fullCalendar('clientEvents')) {
            if (start < e.start && end > e.start ) {
              $('#calendar').fullCalendar('unselect');
              alert("Not enough space");
              return ;
            }
          }
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
			eventRender: (event, element, view) => {
        if (view.name == 'listDay') {
            element.find(".fc-list-item-time").append("<button class='closeon'>X</button>")
        } else {
            element.find(".fc-content").prepend("<button class='closeon'>X</button>")
        }
        element.find(".closeon").on('click', () => {
          $('#calendar').fullCalendar('removeEvents',event._id);
          var events = $('#calendar').fullCalendar('clientEvents');
          var freeTimeDict = this.calendarHelperService.scheduleTimeFormat(events);
          this.transferDataService.setFreeTime(freeTimeDict);
        });
  			var events = $('#calendar').fullCalendar('clientEvents');
        var freeTimeDict = this.calendarHelperService.scheduleTimeFormat(events);
        this.transferDataService.setFreeTime(freeTimeDict);
	    },
	  });

    console.log($('.fc-day-grid').find('.fc-day').append("<input type='checkbox' checked data-toggle='toggle'>"));

  	$('#button1').click(() => {
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
