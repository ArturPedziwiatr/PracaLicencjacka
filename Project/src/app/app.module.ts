import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from  '@angular/common/http';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
 


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
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { AddUserComponent } from './panel/users/add-user/add-user.component';
import { NoPermissionComponent } from './error/noPermission';
import { AddMeetComponent } from './panel/meeting/add-meet/add-meet.component';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ShowTextComponent } from './panel/anty-plagiat/show-text/show-text.component';
import { SettingComponent } from './panel/setting/setting.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ShowMeetingComponent } from './panel/meeting/show-meeting/show-meeting.component';
import { SchedulerComponent } from './panel/meeting/add-meet/scheduler/scheduler.component';
import { Router, RouterModule } from '@angular/router';


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
    AddUserComponent,
    NoPermissionComponent,
    AddMeetComponent,
    ShowTextComponent,
    SettingComponent,
    ShowMeetingComponent,
    SchedulerComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ModalModule,
    NgbModule,
    NgxDropzoneModule,
    Ng2SearchPipeModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    })
  ],
  providers: [SharedService],
  bootstrap: [AppComponent]
})
export class AppModule { }
