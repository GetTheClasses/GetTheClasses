import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SigninComponent } from '../signin/signin.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SignupComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

  ngOnInit() {
  }

  private loading: boolean;

  openSignin(): void {
  	this.dialog.closeAll();
  	this.dialog.open(SigninComponent, {
  		height: '350px',
  		width: '350px'
  	})
  }

  submit(): void {
  	this.loading = true;
  }
}
