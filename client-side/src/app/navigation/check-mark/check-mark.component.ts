import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-check-mark',
  templateUrl: './check-mark.component.html',
  styleUrls: ['./check-mark.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CheckMarkComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
  }

}
