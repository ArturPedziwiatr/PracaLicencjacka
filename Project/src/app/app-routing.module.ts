import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AntyPlagiatComponent } from './panel/anty-plagiat/anty-plagiat.component';
import { MeetingComponent } from './panel/meeting/meeting.component';
import { StudentsComponent } from './panel/students/students.component';
import { TeachersComponent } from './panel/teachers/teachers.component';
import { HomeComponent } from './panel/home/home.component';
import { UsersComponent } from './panel/users/users.component';
import { AuthService } from './auth/auth.service';
import { NoPermissionComponent } from './error/noPermission';
import { SettingComponent } from './panel/setting/setting.component';
import { NotFoundComponent } from './error/not-found.component';

const routes: Routes = [
  {path: 'home', component:HomeComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'student',  component: StudentsComponent, canActivate:[AuthService], },
  {path: 'setting',  component: SettingComponent, canActivate:[AuthService], },
  {path: 'teacher',  component: TeachersComponent, canActivate:[AuthService] },
  {path: 'users',  component: UsersComponent, canActivate:[AuthService]},
  {path: 'meeting', component: MeetingComponent, canActivate:[AuthService] },
  {path: 'plagiat',  component: AntyPlagiatComponent, canActivate:[AuthService]},
  {path: 'noPermission', component:NoPermissionComponent},
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
