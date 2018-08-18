import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HttpMethodService } from '../../http-method.service';
import { environment } from '../../../environments/environment';
import { CheckMarkComponent } from '../../navigation/check-mark/check-mark.component';

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

  submit(): void {
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
          setTimeout(() => this.dialog.closeAll(), 1500);
        });
      }
      else {
        this.error = result.error;
      }
      this.loading = false;
    });
  }
}
