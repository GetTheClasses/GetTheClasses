import { Component, OnInit } from '@angular/core';
import { TransferDataService } from '../services/transfer-data.service';

@Component({
  selector: 'app-submit-buttons',
  templateUrl: './submit-buttons.component.html',
  styleUrls: ['./submit-buttons.component.css']
})
export class SubmitButtonsComponent implements OnInit {

  constructor(private transferDataService: TransferDataService) { }

  ngOnInit() {
  }

}
