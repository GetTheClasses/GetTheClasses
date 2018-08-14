import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SigninComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  private loading: boolean;

	openSignup(): void {
  	this.dialog.closeAll();
  	this.dialog.open(SignupComponent, {
  		height: '350px',
  		width: '350px'
  	})
  }

  submit(): void {
  	this.loading = true;
  }
}
