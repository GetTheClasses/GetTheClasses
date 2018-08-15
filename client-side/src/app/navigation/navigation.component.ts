import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {

	@Output() userID = new EventEmitter();

  constructor() { }

  getUserID(e): void {
  	this.userID.emit(e)
  }
}
