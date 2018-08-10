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
	  	courseSelected: any;
		eventsData: any[] = [];
		timeRanges = {};

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
