import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent {

  constructor(public dialog: MatDialog) { }

  openSignin(): void {
  	this.dialog.open(SigninComponent, {
  		height: '350px',
  		width: '350px'
  	})
  } 

  openSignup(): void {
  	this.dialog.open(SignupComponent, {
  		height: '350px',
  		width: '350px'
  	})
  } 
}
