import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SignupComponent } from '../signup/signup.component';
import { HttpMethodService } from '../../http-method.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SigninComponent implements OnInit {

  constructor(public dialog: MatDialog,
    private methodHelper: HttpMethodService) { }

  ngOnInit() {
  }

  private loading: boolean;
  private signin_email: string;
  private signin_password: string;
  private error: string = "";

	openSignup(): void {
  	this.dialog.closeAll();
  	this.dialog.open(SignupComponent, {
  		height: '350px',
  		width: '350px'
  	})
  }

  submit(): void {
    this.loading = true;
    this.methodHelper.post(environment.HOST + '/api/login', {
      email: this.signin_email,
      password: this.signin_password
    }).subscribe((result) => {
      if (!result.success) {
        console.log(this.error);
        this.error = result.error;
      }
      else {
        this.error = "";
        this.dialog.closeAll();
      }
      this.loading = false;
    })
  }
}