import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { InputComponent } from './input/input.component';
import { CalendarComponent } from './calendar/calendar.component';
import { SubmitButtonsComponent } from './submit-buttons/submit-buttons.component';

@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    CalendarComponent,
    SubmitButtonsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
