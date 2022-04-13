import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from  '@angular/common/http';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuBarComponent } from './menu-bar/menu-bar.component';
import { SharedService } from './services/shared.service';
import { MeetingComponent } from './panel/meeting/meeting.component';
import { StudentsComponent } from './panel/students/students.component';
import { TeachersComponent } from './panel/teachers/teachers.component';
import { AntyPlagiatComponent } from './panel/anty-plagiat/anty-plagiat.component';
import { HomeComponent } from './panel/home/home.component';
import { UsersComponent } from './panel/users/users.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ModalModule } from 'ngb-modal';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddUserComponent } from './panel/users/add-user/add-user.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuBarComponent,
    MeetingComponent,
    StudentsComponent,
    TeachersComponent,
    AntyPlagiatComponent,
    HomeComponent,
    UsersComponent,
    SignInComponent,
    AddUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ModalModule,
    NgbModule
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
