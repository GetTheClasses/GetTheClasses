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
  dictTime = { 1: 'm', 2: 't', 3: 'w', 4: 'r', 5: 'f', 6: 's' };

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
      dayClick: (date, jsEvent, view) => {
        if ($(jsEvent.target).hasClass('fc-day')) {
          var freeTime = this.transferDataService.getFreeTime();
          if (freeTime == undefined || freeTime[this.dictTime[date.day()]] == []
            || freeTime[this.dictTime[date.day()]].toString() != [[800, 2100]].toString()) {
            
            for (var e of $('#calendar').fullCalendar('clientEvents')) {
              if (e.start.day() == date.day()) {
                $('#calendar').fullCalendar('removeEvents', e._id);
              }
            }

            var start = moment("08:00", "hh:mm");
            start.day(date.day());
            var end = moment("21:00", "hh:mm");
            end.day(date.day());

            $('#calendar').fullCalendar('renderEvent', {
              start: start,
              end: end
            })
          }
          else {
            for (var e of $('#calendar').fullCalendar('clientEvents')) {
              if (e.start.day() == date.day()) {
                $('#calendar').fullCalendar('removeEvents', e._id);
                var events = $('#calendar').fullCalendar('clientEvents');
                var freeTimeDict = this.calendarHelperService.scheduleTimeFormat(events);
                this.transferDataService.setFreeTime(freeTimeDict);
              }
            }
          }
        }
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

    // console.log($('.fc-day-grid').find('.fc-day').prepend(`<div class="mat-checkbox-inner-container" style="z-index:10"><input class="mat-checkbox-input cdk-visually-hidden" type="checkbox" id="mat-checkbox-2-input" tabindex="0" aria-checked="true"><div class="mat-checkbox-ripple mat-ripple" matripple="" ng-reflect-centered="true" ng-reflect-radius="25" ng-reflect-animation="[object Object]" ng-reflect-disabled="false" ng-reflect-trigger="[object HTMLLabelElement]"></div><div class="mat-checkbox-frame"></div><div class="mat-checkbox-background"><svg xml:space="preserve" class="mat-checkbox-checkmark" focusable="false" version="1.1" viewBox="0 0 24 24"><path class="mat-checkbox-checkmark-path" d="M4.1,12.7 9,17.6 20.3,6.3" fill="none" stroke="white"></path></svg><div class="mat-checkbox-mixedmark"></div></div></div>`));
    // $('.fc-day-grid').removeClass('')
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
