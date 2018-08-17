import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TransferDataService } from '../services/transfer-data.service';
import { CalendarHelperService } from '../services/calendar-helper.service';
import { HttpMethodService } from '../http-method.service';
import { environment } from '../../environments/environment';

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
		private calendarHelperService: CalendarHelperService,
		private methodHelper: HttpMethodService) { }

	courseSelected: any;
	eventsData: any[] = [];
	timeRanges = {};
	clicked: boolean = false;
	dateRangeClicked: string = '';
	private userID: string;


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
			eventResize: (event) => {
				// Handle resize issue here (start-end range is too small)
				console.log(event.start.format("HH:mm"));
				console.log(event.end.format("HH:mm"));
			},
			selectConstraint: {
				start: "08:00",
				end: "21:00"
			},
			eventConstraint: {
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
			select: (start, end, event) => {
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
				}
				else {
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
						// $(".fc-body " + ".fc-row " + date).prepend("<div align='center'><button class='timeRangeStyle' mat-button>Select All</button></div>")
					}
				}
				element.find(".timeRangeStyle").on('click', ($event) => {
					this.selectTimeFrame($event);
				})
			}
		});
	}

  ngOnInit() {
	  this.calendarCompo();
  	}

	selectTimeFrame(event) {
		var dateEvent = event.currentTarget.offsetParent.attributes[0].textContent;
		var dates = dateEvent.split(' ');
		var dateEvent = dates[2].slice(dates[2].length - 3, dates[2].length);
		this.clicked = !this.clicked;
		if (this.clicked == true) {
			var id = dateEvent;
			$("#calendar").fullCalendar('addEventSource', [{
				id: id,
				start: moment("08:00", "hh:mm").day(dateEvent),
				end: moment("21:00", "hh:mm").day(dateEvent),
			}])
		} else {
			$('#calendar').fullCalendar('removeEvents', dateEvent);
		}
	}

	recieveMess($event) {
		console.log($event);
		var eventCloseorOpen = $event["on/off"];
		// if status == 1 then update
		if (eventCloseorOpen == 1) {
			for (var ele of $event) {
				if (typeof(ele) === 'object') {
					this.updateCalendar(ele);
				}
			}
		}
		// else status == 0 then remove event
		else {
			for (var ele of $event) {
				if (typeof(ele) === 'object') {
					this.removeEventCalendar(ele);
				}
			}
		}

		// var timeRanges = this.analyzeDates($event.time);
		// console.log(timeRanges);
		// var timeStarts = this.analyzetimeStart($event.time);
		// var timeEnds = this.analyzetimeEnd($event.time);
		// this.eventsData = [];
		// var randomColor = this.getRandomColor();

		// WORKING
		// for (var i = 0; i < timeRanges.length; i++) {
		// 	for (var j = 0; j < timeRanges[i].length; j++) {
		// 		$("#calendar").fullCalendar('addEventSource', [{
		// 			title: 'Need to update',
		// 			start: moment(timeStarts[i], "hh:mm").day(timeRanges[i][j]),
		// 			end: moment(timeEnds[i], "hh:mm").day(timeRanges[i][j]),
		// 			borderColor: 'black',
		// 			textColor: 'white',
		// 			color: randomColor,
		// 			editable: true,
		// 			overlap: false,
		// 		}]);
		// 	}
		// }

		// console.log(this.eventsData);
		// for (var ele of this.eventsData) {
		// 	$("#calendar").fullCalendar('addEventSource', [ele]);
		// }

		// for (var i = 0; i < this.timeRanges['start'].length; i++) {
		// 	this.eventsData.push({
		// 		title: $event.name + '  Professor: ' + $event.professor,
		// 		start: moment("08:00", "hh:mm").day("Monday"),
		// 		end: moment("12:00", "hh:mm").day("Monday"),
		// 		borderColor: 'black',
		// 		textColor: 'white',
		// 		color: randomColor,
		// 		editable: true,
		// 		overlap: false,
		// 	})
		// }
	}

	updateCalendar(event) {
		$("#calendar").fullCalendar('removeEvents', 903139168);
		console.log(event);
		var timeRanges = this.analyzeDates(event.classTime);
		console.log(timeRanges);
		var timeStarts = this.analyzetimeStart(event.classTime);
		var timeEnds = this.analyzetimeEnd(event.classTime);
		this.eventsData = [];
		var randomColor = this.getRandomColor();

		for (var i = 0; i < timeRanges.length; i++) {
			for (var j = 0; j < timeRanges[i].length; j++) {
				$("#calendar").fullCalendar('addEventSource', [{
					id: event.crn,
					title: event.description,
					start: moment(timeStarts[i], "hh:mm").day(timeRanges[i][j]),
					end: moment(timeEnds[i], "hh:mm").day(timeRanges[i][j]),
					borderColor: 'black',
					textColor: 'white',
					color: randomColor,
					editable: true,
					overlap: false,
				}]);
			}
		}
	}

	removeEventCalendar(event) {
		$("#calendar").fullCalendar('removeEvents', event.crn);
	}

	// Auto generate random colors
	getRandomColor() {
		var letters = '0123456789ABCDEF'; //HEX
		var color = '#';
		for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	analyzetimeStart(str) {
		var datas = str.split('|');
		var output = [];
		for (var i = 0; i < datas.length; i++) {
			var timeStart = '';
			switch (i) {
				case 1:
				case 3:
					timeStart = datas[i].slice(0, 2) + ":" + datas[i].slice(2, 4);
					output.push(timeStart);
					break
			}
		}
		return output;
	}

	analyzetimeEnd(str) {
		var datas = str.split('|');
		var output = [];
		for (var i = 0; i < datas.length; i++) {
			var timeEnd = '';
			switch (i) {
				case 1:
				case 3:
					timeEnd = datas[i].slice(datas[i].length - 4, datas[i].length -2) + ":" + datas[i].slice(datas[i].length - 2, datas[i].length);
					output.push(timeEnd);
					break
			}
		}
		return output;
	}

	analyzeDates(str) {
		// var str = "TW|12001350|W|14001530";
		var date = {
			'M': 'Mon',
			'T': 'Tue',
			'W': 'Wed',
			'R': 'Thu',
			'F': 'Fri',
			'Sa': 'Sat'
		}
		var datas = str.split('|');
		var timeRanges = [];
		// var timeStarts = [];
		// var timeEnds = [];

		for (var i = 0; i < datas.length; i ++) {
			var getDate = '';
			var actualDate = [];
			// var timeStart = '';
			// var timeEnd = '';
			switch (i) {
				case 0:
				case 2:
					// Dates
					for (var ele of datas[i]) {
						getDate = ele;
						actualDate.push(date[getDate]);
					}
					timeRanges.push(actualDate);
					break;

				// case 1:
				// case 3:
				// 	// Time Start
				// 	timeStart = datas[i].slice(0, 2) + ":" + datas[i].slice(2, 4);
				// 	timeStarts.push(timeStart);
				// 	// Time End
				// 	timeEnd = datas[i].slice(datas[i].length - 4, datas[i].length -2) + ":" + datas[i].slice(datas[i].length - 2, datas[i].length);
				// 	timeEnds.push(timeEnd);
				// 	break;
			}
		}

		return timeRanges;
		// for (var i = 0; i < timeRanges.length; i++) {
		// 	for (var j = 0; j < timeRanges[i].length; j++) {
		// 		$("#calendar").fullCalendar('addEventSource', [{
		// 			start: moment(timeStarts[i], "hh:mm").day(timeRanges[i][j]),
		// 			end: moment(timeEnds[i], "hh:mm").day(timeRanges[i][j]),
		// 		}])
		// 	}
		// }
	}

	getUserID(e): void {
		this.userID = e;
		this.methodHelper.get(environment.HOST + '/api/fetchDataOfUser/?userID=' + e)
		.subscribe((result) => {
			var events = [];
			result.forEach((event) => {
				console.log(event);
				events.push({
					start: moment(event.start, "d|HHmm"),
					end: moment(event.end, "d|HHmm")
				});
			});
			$('#calendar').fullCalendar('removeEvents');
			$('#calendar').fullCalendar('addEventSource', events);
		});
	}
}
