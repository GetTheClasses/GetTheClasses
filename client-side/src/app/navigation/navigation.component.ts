import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SigninComponent } from '../authentication/signin/signin.component';
import { SignupComponent } from '../authentication/signup/signup.component';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }
}
