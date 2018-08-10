import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
// import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { AppComponent } from './app.component';
import { InputComponent } from './input/input.component';
import { CalendarComponent } from './calendar/calendar.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/primeng';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { SubmitButtonsComponent } from './submit-buttons/submit-buttons.component';
import { DisplayDataComponent } from './display-data/display-data.component';

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    CalendarComponent,
    SubmitButtonsComponent,
    DisplayDataComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AutoCompleteModule,
    BrowserAnimationsModule,
    DropdownModule,
    NgSelectModule,
    FormsModule,
    MatButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
