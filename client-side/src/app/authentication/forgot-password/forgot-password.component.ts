import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpMethodService } from '../../http-method.service';
import { environment } from '../../../environments/environment';
import { CheckMarkComponent } from '../../navigation/check-mark/check-mark.component';
import { SigninComponent } from '../signin/signin.component';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private methodHelper: HttpMethodService, 
    private dialog: MatDialog) { }

  private error: string;
  private loading: boolean;
  private email: string;

  ngOnInit() {
  }
  
  openSignIn(): void {
    this.dialog.closeAll();
    this.dialog.open(SigninComponent, {
      height: '380px',
      width: '350px'
    });
  }

  openSignUp(): void {
    this.dialog.closeAll();
    this.dialog.open(SignupComponent, {
      height: '385px',
      width: '350px'
    });
  }

  submit(): void {
    this.error = "";
    this.loading = true;
    this.methodHelper.post(environment.HOST + "/api/resetPassword", {
      email: this.email
    }).subscribe((result) => {
      if (result.success) {
        this.dialog.closeAll();
        this.dialog.open(CheckMarkComponent, {
          data: "Verification Sent!"
        }).afterOpen()
        .subscribe(() => {
          setTimeout(() => this.dialog.closeAll(), 2000);
        });
      }
      else {
        this.error = result.error;
      }
      this.loading = false;
    });
  }
}
