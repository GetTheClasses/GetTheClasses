import { Component, OnInit, ViewEncapsulation, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
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
  public onAdd = new EventEmitter();

	openSignup(): void {
  	this.dialog.closeAll();
  	this.dialog.open(SignupComponent, {
  		height: '350px',
  		width: '350px'
  	}).componentInstance.onAdd.subscribe((data) => {
      if (data.success) {
        this.onAdd.emit(data);
      }
    });
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
        console.log(result);
        this.onAdd.emit(result);
        this.dialog.closeAll();
      }
      this.loading = false;
    })
  }
}
