import { Component, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent {

  @Output() identify = new EventEmitter();

  constructor(public dialog: MatDialog) { }
  private identifier = {success:false};

  openSignin(): void {
  	this.dialog.open(SigninComponent, {
  		height: '350px',
  		width: '350px'
  	}).componentInstance.onAdd.subscribe((data) => {
      if (data.success) {
        this.identifier = data;
        this.identify.emit(data.userID);
      }
    })
  }

  signout(): void {
    alert("Working on :P")
  }
}
