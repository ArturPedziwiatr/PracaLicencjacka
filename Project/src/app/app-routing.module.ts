import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AntyPlagiatComponent } from './panel/anty-plagiat/anty-plagiat.component';
import { MeetingComponent } from './panel/meeting/meeting.component';
import { StudentsComponent } from './panel/students/students.component';
import { TeachersComponent } from './panel/teachers/teachers.component';
import { HomeComponent } from './panel/home/home.component';
import { UsersComponent } from './panel/users/users.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthService } from './auth/auth.service';

const routes: Routes = [
  {path: 'home', component:HomeComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'student',  component: StudentsComponent, canActivate:[AuthService], },
  {path: 'teacher',  component: TeachersComponent, canActivate:[AuthService] },
  {path: 'users',  component: UsersComponent, canActivate:[AuthService]},
  {path: 'meeting', component: MeetingComponent, canActivate:[AuthService] },
  {path: 'plagiat',  component: AntyPlagiatComponent, canActivate:[AuthService]},
  {path: 'login', component:SignInComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
