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
import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatFormFieldModule } from '@angular/material/form-field';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule, MatFormFieldModule } from '@angular/material';
import { MatStepperModule } from '@angular/material/stepper';
import { MatBadgeModule } from '@angular/material/badge';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { SigninComponent } from './authentication/signin/signin.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { NavigationComponent } from './navigation/navigation.component';
import { FooterComponent } from './footer/footer.component';
import { LoaderComponent } from './navigation/loader/loader.component';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CheckMarkComponent } from './navigation/check-mark/check-mark.component';



@NgModule({
  declarations: [
    AppComponent,
    InputComponent,
    CalendarComponent,
    SubmitButtonsComponent,
    DisplayDataComponent,
    SigninComponent,
    SignupComponent,
    AuthenticationComponent,
    NavigationComponent,
    FooterComponent,
    LoaderComponent,
    CheckMarkComponent
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
    MatAutocompleteModule,
    MatDialogModule,
    MatSidenavModule,
    MatListModule,
    MatPaginatorModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    SigninComponent,
    SignupComponent,
    CheckMarkComponent
  ]
})
export class AppModule { }
