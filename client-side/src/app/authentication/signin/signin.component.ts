import { Component, OnInit, ViewEncapsulation, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SignupComponent } from '../signup/signup.component';
import { HttpMethodService } from '../../http-method.service';
import { environment } from '../../../environments/environment';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { CheckMarkComponent } from '../../navigation/check-mark/check-mark.component';

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
  public onAdd = new EventEmitter();

	openSignup(): void {
  	this.dialog.closeAll();
  	this.dialog.open(SignupComponent, {
  		height: '385px',
  		width: '350px'
  	}).componentInstance.onAdd.subscribe((data) => {
      if (data.success) {
        this.onAdd.emit(data);
      }
    });
  }

  openForgotPassword(): void {
    this.dialog.closeAll();
    this.dialog.open(ForgotPasswordComponent, {
      height: '325px',
      width: '350px'
    })
  }

  submit(): void {
    this.loading = true;
    this.error = "";
    this.methodHelper.post(environment.HOST + '/api/login', {
      email: this.signin_email,
      password: this.signin_password
    }).subscribe((result) => {
      if (!result.success) {
        this.error = result.error;
      }
      else {
        this.onAdd.emit(result);
        this.dialog.closeAll();
        this.dialog.open(CheckMarkComponent, {
          data: "Signed in as " + result.name 
        }).afterOpen()
        .subscribe(() => {
          setTimeout(() => this.dialog.closeAll(), 1500);
        });
      }
      this.loading = false;
    })
  }
}
