import { Component, OnInit } from '@angular/core';
import { TransferDataService } from '../services/transfer-data.service';

@Component({
  selector: 'app-submit-buttons',
  templateUrl: './submit-buttons.component.html',
  styleUrls: ['./submit-buttons.component.css']
})
export class SubmitButtonsComponent {

  constructor(private transferDataService: TransferDataService) { }

  displayFreeTime(): void {
  	var freeTime = this.transferDataService.getFreeTime();
  	console.log(freeTime);
  }

}
