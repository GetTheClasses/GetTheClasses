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

	calendarCompo() {
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
			// defaultDate: '2018-08-20',
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
				console.log(start);
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
						return;
					}
				}
			}
			$('#calendar').fullCalendar('unselect');
			// console.log(start);
			// console.log(end);
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
			// element.find(".fc-mon").prepend("<button class='closeon'>X</button>")
			// element.find("fc-day fc-widget-content fc-mon fc-past").append("<button class='closeon'>X</button>")
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
		viewRender: (view, element) => {
			if (view.name == 'agendaWeek') {
				for (var i = 0; i < 6; i++) {
					var date = '';
					switch (i) {
						case 0:
							date = '.fc-mon';
							break
						case 1:
							date = '.fc-tue';
							break
						case 2:
							date = '.fc-wed';
							break
						case 3:
							date = '.fc-thu';
							break
						case 4:
							date = '.fc-fri';
							break
						case 5:
							date ='.fc-sat';
							break
					}
					$(".fc-body " + ".fc-row " + date).prepend("<div align='center'><button class='timeRangeStyle' mat-button>Select Time</button></div>")
				}
			}
		}
	});
	}

  ngOnInit() {
	  this.calendarCompo();
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
				// start: this.timeRanges['start'][i],
				// end: this.timeRanges['end'][i],
				start: moment("08:00", "hh:mm").day("Monday"),
				end: moment("12:00", "hh:mm").day("Monday"),
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

	// var start = moment("08:00", "hh:mm");
	// start.day(date.day());
	// var end = moment("21:00", "hh:mm");
	// end.day(date.day());

	getRandomColor() {
		var letters = '0123456789ABCDEF'; //HEX
		var color = '#';
		for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	analyzetimeStart(str) {
		var time = str.slice(str.indexOf('-') + 1, str.indexOf('-') + 7);
		return time.trim()
	}

	analyzetimeEnd(str) {
		var time = str.slice(str.length - 6, str.length);
		return time.trim()
	}


	analyzeDate(str) {
		var date = {
			'M': 'Monday',
			'T': 'Tuesday',
			'W': 'Wednesday',
			'Th': 'Thursday',
			'F': 'Friday',
			'Sa': 'Sartuday'
		}
		var timeRange = str.slice(0, str.indexOf('-') - 1).trim();
		for (var i = 0; i < timeRange.length; i++) {
			var currDate = timeRange[i];
			var dateFormat = date[currDate];
			// var timeStart = this.analyzetimeStart(str);
			// var timeEnd = this.analyzetimeEnd(str);
			this.timeRanges['start'].push(dateFormat);
			this.timeRanges['end'].push(dateFormat)
		}
	}
}
