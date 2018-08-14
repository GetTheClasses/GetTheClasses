import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-display-data',
  templateUrl: './display-data.component.html',
  styleUrls: ['./display-data.component.css']
})
export class DisplayDataComponent implements OnInit {

  panelOpenState = false;

  constructor() { }

  ngOnInit() {}

  mouseEnter(div : string){
    console.log("mouse enter : " + div);
  }

  mouseLeave(div : string){
    console.log('mouse leave :' + div);
  }

  test(event) {
    console.log(event);
  }
}
