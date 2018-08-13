import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
// import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { AppComponent } from './app.component';
import { InputComponent } from './input/input.component';
import { CalendarComponent } from './calendar/calendar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/primeng';
import { CardModule } from 'primeng/card';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubmitButtonsComponent } from './submit-buttons/submit-buttons.component';
import { DisplayDataComponent } from './display-data/display-data.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
// import { MatFormFieldModule } from '@angular/material/form-field';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule, MatFormFieldModule } from '@angular/material';
import { MatStepperModule } from '@angular/material/stepper';
import { MatBadgeModule } from '@angular/material/badge';
import { MatAutocompleteModule } from '@angular/material/autocomplete';






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
    MatButtonModule,
    CardModule,
    MatChipsModule,
    MatExpansionModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    ToggleButtonModule,
    MatTooltipModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatStepperModule,
    MatBadgeModule,
    MatAutocompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
