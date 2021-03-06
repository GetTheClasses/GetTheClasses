import { Component, ViewEncapsulation, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpMethodService } from '../../http-method.service';
import { environment } from '../../../environments/environment';
import { CheckMarkComponent } from '../../navigation/check-mark/check-mark.component';
import { SigninComponent } from '../signin/signin.component';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SignupComponent{

  constructor(private dialog: MatDialog,
    private methodHelper: HttpMethodService) { }

  private error: string;
  private loading: boolean;
  private signup_email;
  private signup_password;
  private signup_confirm_password;
  public onAdd = new EventEmitter();

  openSignIn(): void {
    this.dialog.closeAll();
    this.dialog.open(SigninComponent, {
      height: '385px',
      width: '350px'
    });
  }

  openForgotPassword(): void {
    this.dialog.closeAll();
    this.dialog.open(ForgotPasswordComponent, {
      height: '325px',
      width: '350px'
    });
  }

  submit(): void {
    if (this.signup_confirm_password == this.signup_password) {
      this.loading = true;
      this.error = "";
      this.methodHelper.post(environment.HOST + '/api/signup', {
        email: this.signup_email,
        password: this.signup_password
      }).subscribe((result) => {
        if (!result.success) {
          this.error = result.error;
        }
        else {
          this.onAdd.emit(result);
          this.dialog.closeAll();
          this.dialog.open(CheckMarkComponent, {
            data: "Account Created!"
          }).afterOpen()
          .subscribe(() => {
            setTimeout(() => this.dialog.closeAll(), 1000);
          });
        }
        this.loading = false;
      })
    }
    else {
      this.error = "Password does not match."
    }
  }
}
