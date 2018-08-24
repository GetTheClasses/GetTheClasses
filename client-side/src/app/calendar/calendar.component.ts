import { MatTooltipModule } from '@angular/material/tooltip';
import { element } from 'protractor';
import { TransferDataService } from './../services/transfer-data.service';
import { Component, OnInit, ViewEncapsulation, Output} from '@angular/core';
import { CalendarHelperService } from '../services/calendar-helper.service';
import { first } from '../../../node_modules/rxjs/operators';
import { last } from '../../../node_modules/@angular/router/src/utils/collection';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
	// timeSetEventsSelected = [];
	selectable = true;
	removable = true;
	id = 3;
	private userID: string;
	private saveEventsForDelete = [];


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
			displayEventTime: true,
			eventResize: (event) => {
				// Handle resize issue here (start-end range is too small)
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
					end: end,
					className: 'fc-transparent-event',
					// rendering: 'background',
				  })
				  	// Add to chips
					// var evento = $("#calendar").fullCalendar('clientEvents');
					// this.dayAdd(evento);
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
					block: true,
					className: 'fc-transparent-event',
					// rendering: 'background',
				}]);
				// Add to chips
				// var evento = $("#calendar").fullCalendar('getEventSources');
				// this.add(evento, start, end);
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
					console.log(event);
					$('#calendar').fullCalendar('removeEvents',event._id);
					// if (this.timeSetEventsSelected.length > 0) {
						// this.closeOnRemoveChip(event);
					// }
					var events = $('#calendar').fullCalendar('clientEvents');
					var freeTimeDict = this.calendarHelperService.scheduleTimeFormat(events);
					this.transferDataService.setFreeTime(freeTimeDict);
				});
				var events = $('#calendar').fullCalendar('clientEvents');
				var freeTimeDict = this.calendarHelperService.scheduleTimeFormat(events);
				this.transferDataService.setFreeTime(freeTimeDict);
			},
			// Allow to overlap event for set free time
			eventOverlap: function(stillEvent, movingEvent) {
				return stillEvent.rendering == "background";
			},

			// DONT DELETE, WILL IMPROVE LATER
			// Add button on allday section
			// viewRender: (view, element) => {
			// 	if (view.name == 'agendaWeek') {
			// 		for (var i = 0; i < 6; i++) {
			// 			var date = '';
			// 			switch (i) {
			// 				case 0:
			// 					date = '.fc-mon';
			// 					break
			// 				case 1:
			// 					date = '.fc-tue';
			// 					break
			// 				case 2:
			// 					date = '.fc-wed';
			// 					break
			// 				case 3:
			// 					date = '.fc-thu';
			// 					break
			// 				case 4:
			// 					date = '.fc-fri';
			// 					break
			// 				case 5:
			// 					date ='.fc-sat';
			// 					break
			// 			}
			// 			$(".fc-body " + ".fc-row " + date).prepend("<div align='center'><button class='timeRangeStyle' mat-button>Select All</button></div>")
			// 		}
			// 	}
			// 	element.find(".timeRangeStyle").on('click', ($event) => {
			// 		this.selectTimeFrame($event);
			// 	})
			// },

			// Handle mouse over
			eventMouseover: function (data) {
				console.log(data);
				var timeStart = data.start._i;
				var timeEnd = data.end._i;
				var title = data.title;
				var datas = title.split('-');
				var crn = datas[1];
				var courseTitle = datas[0];
				var className = datas[2];
				var classSection = datas[3];
				var tooltip = '<div class="tooltiptopicevent" style="width:auto; height:auto; background:white; border-radius: 25px; border: 2px solid #73AD21; padding: 20px;' +
				'position:absolute; z-index:10001; padding:10px 10px 10px 10px ;' + 'line-height: 200%;">' +
				'Title: ' + ': ' + courseTitle + '</br>' + 'Time Start: ' + timeStart + '</br>' +
				'Time End: ' + timeEnd + '</br>' + 'Class Name: ' + className + '</br>' + 'Class Section: ' + classSection +
				'</br>' + 'CRN: ' + crn + '</br>' + '</div>';

				$("body").append(tooltip);
				$(this).mouseover(function (e) {
					$(this).css('z-index', 10000);
					$('.tooltiptopicevent').fadeIn('500');
					$('.tooltiptopicevent').fadeTo('10', 1.9);
				}).mousemove(function (e) {
					$('.tooltiptopicevent').css('top', e.pageY + 10);
					$('.tooltiptopicevent').css('left', e.pageX + 20);
				});
			},
			eventMouseout: function (data, event, view) {
				$(this).css('z-index', 8);
				$('.tooltiptopicevent').remove();
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
		if ($event['hover'] == true) {
			// var allEvents = $('#calendar').fullCalendar('clientEvents');
			// this.saveEventsForDelete.forEach((time) => {
			// 	var index = 0;
			// 	while (index < allEvents.length) {
			// 		if (this.equalTime(allEvents[index], time)) {}
			// 	}
			// })
			$('#calendar').fullCalendar('removeEvents');
			var events = []
			for (var ele of $event) {
				if (typeof(ele) === 'object') {
					this.updateEvent(ele, events);
				}
			}
			$('#calendar').fullCalendar('addEventSource', events);
		}
		else {
			console.log("Not hover");
			var eventCloseorOpen = $event["on/off"];
			var id = $event['privateID'];
			if (id == undefined)
				id = 100;
			// if status == 1 then update
			if (eventCloseorOpen == 1) {
				for (var ele of $event) {
					if (typeof(ele) === 'object') {
						this.updateCalendar(ele, id);
					}
				}
			}
			// else status == 0 then remove event
			else {
				for (var ele of $event) {
					if (typeof(ele) === 'object') {
						this.removeEventCalendar($event);
					}
				}
			}
		}
	}

	updateCalendar(event, _id) {
		var timeRanges = this.analyzeDates(event.classTime);
		var timeStarts = this.analyzetimeStart(event.classTime);
		var timeEnds = this.analyzetimeEnd(event.classTime);
		var randomColor = this.getRandomColor();
		console.log(timeRanges);
		console.log(timeStarts);
		console.log(timeEnds);

		for (var i = 0; i < timeRanges.length; i++) {
			for (var j = 0; j < timeRanges[i].length; j++) {
				$("#calendar").fullCalendar('addEventSource', [{
					id: _id,
					title: event.description,
					start: moment(timeStarts[i], "hh:mm").day(timeRanges[i][j]),
					end: moment(timeEnds[i], "hh:mm").day(timeRanges[i][j]),
					borderColor: 'black',
					textColor: 'black',
					color: 'yellow',
					resourceEditable: false
				}]);
			}
		}
		this.id += 3;
	}

	updateEvent(event, events) {
		var timeRanges = this.analyzeDates(event.classTime);
		var timeStarts = this.analyzetimeStart(event.classTime);
		var timeEnds = this.analyzetimeEnd(event.classTime);
		for (var i = 0; i < timeRanges.length; i++) {
			for (var j = 0; j < timeRanges[i].length; j++) {
				events.push({
					title: event.description,
					start: moment(timeStarts[i], "hh:mm").day(timeRanges[i][j]),
					end: moment(timeEnds[i], "hh:mm").day(timeRanges[i][j]),
					borderColor: 'black',
					textColor: 'black',
					color: 'yellow',
					resourceEditable: false
				});
			}
		}
	}

	// dayAdd(event) {
	// 	console.log(event);
	// 	var lastEle = event[event.length - 1];
	// 	var uniqueID = lastEle._id;
	// 	var timeStart = lastEle.start._i;
	// 	var timeEnd = lastEle.end._i;
	// 	var finalTime = timeStart + ' -> ' + timeEnd;
	// 	var dateChose = lastEle.end._d.toString();
	// 	dateChose = dateChose.slice(0, 3);
	// 	var output = {
	// 		id: uniqueID,
	// 		date: dateChose,
	// 		time: finalTime
	// 	}
	// 	this.insertTimeInSortedOrder(output);
	// }

	// add(event, startTime, endTime) :void {
	// 	var lastEle = event[event.length - 1];
	// 	var uniqueID = lastEle.eventDefs[0].uid;
	// 	startTime = startTime._d.toString();
	// 	endTime = endTime._d.toString();
	// 	var timeStart = this.getLocalTime(startTime);
	// 	var timeEnd = this.getLocalTime(endTime);
	// 	var dateChose = startTime.slice(0, 3).trim();
	// 	var finalTime = timeStart + ' -> ' + timeEnd;
	// 	var output = {
	// 		id: uniqueID,
	// 		date: dateChose,
	// 		time: finalTime
	// 	}
	// 	// this.insertTimeInSortedOrder(output);
	// }

	// Chips removal
	// remove(time): void {
	// 	const index = this.timeSetEventsSelected.indexOf(time);
	// 	if (index >= 0) {
	// 		this.timeSetEventsSelected.splice(index, 1);
	// 	}
	// 	// Remove Event in calendar view
	// 	$("#calendar").fullCalendar('removeEvents', time.id);
	// }

	// closeOnRemoveChip(timeEvent) {
	// 	for (var i = 0; i < this.timeSetEventsSelected.length; i++) {
	// 		if (this.timeSetEventsSelected[i].id === timeEvent._id) {
	// 			this.timeSetEventsSelected.splice(i, 1);
	// 			break;
	// 		}
	// 	}
	// }

	removeEventCalendar(event) {
		$("#calendar").fullCalendar('removeEvents', event['privateID']);

		// need to fix if we delete in calendar then will disable in input select
	}

	// getLocalTime(str) {
	// 	var indexStart = str.indexOf(':') - 2;
	// 	var indexEnd = str.indexOf(':') + 1;
	// 	var localStart = (parseInt((str.slice(indexStart, indexStart + 2)) + '') + 4) + '';
	// 	var localEnd = str.slice(indexEnd, indexEnd + 2);
	// 	return localStart + ':' + localEnd;
	// }

	// Make the chips append in order
	// insertTimeInSortedOrder(object) {
	// 	var added = false;
	// 	if (this.timeSetEventsSelected.length == 0) {
	// 		this.timeSetEventsSelected.push(object);
	// 	}
	// 	else if (this.timeSetEventsSelected.length > 0) {
	// 		for (var i = 0; i < this.timeSetEventsSelected.length; i++) {
	// 			if (this.timeSetEventsSelected[i].date == object.date) {
	// 				this.timeSetEventsSelected.splice(i + 1, 0, object);
	// 				added = true;
	// 				break;
	// 			}
	// 		}
	// 		if (!added) {
	// 			this.timeSetEventsSelected.push(object);
	// 		}
	// 	}
	// }

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

		for (var i = 0; i < datas.length; i ++) {
			var getDate = '';
			var actualDate = [];
			switch (i) {
				case 0:
				case 2:
					for (var ele of datas[i]) {
						getDate = ele;
						actualDate.push(date[getDate]);
					}
					timeRanges.push(actualDate);
					break;
			}
		}

		return timeRanges;
	}

	getUserID(e): void {
		this.userID = e;
		this.methodHelper.get(environment.HOST + '/api/fetchDataOfUser/?userID=' + e)
		.subscribe((result) => {
			var events = [];
			if (result.success) {
				result.forEach((event) => {
					events.push({
						start: moment(event.start, "d|HHmm"),
						end: moment(event.end, "d|HHmm")
					});
				});
				$('#calendar').fullCalendar('removeEvents');
				$('#calendar').fullCalendar('addEventSource', events);
			}
		});
	}

	printCalendar(): void {
		var data = document.getElementById('calendar');
		html2canvas(data).then(canvas => {
			var imgWidth = 208;
			// var pageHeight = 295;
			var imgHeight = canvas.height * imgWidth / canvas.width;
			// var heighLeft = imgHeight;

			const contentDataURL = canvas.toDataURL('image/png');
			let pdf = new jsPDF('l', 'mm', 'a4');
			var position = 0;
			pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
			pdf.save('fall-2018.pdf');
		});
	}

	equalTime(a, b): boolean {
		var sameStart = a.start.hours() == b.start.hours() && a.start.minutes() == b.start.minutes() && a.start.days() == b.start.days();
		var sameEnd = a.end.hours() == b.end.hours() && a.end.minutes() == b.end.minutes() && a.end.days() == b.end.days()
		return sameStart && sameEnd;
	}
}
