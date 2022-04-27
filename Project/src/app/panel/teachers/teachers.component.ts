import { Component, OnInit } from '@angular/core';
import { Teacher } from 'src/app/model/teacherDto';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {

  searchText:string='';
  teacherList:Teacher[] = [];
  PhotoFilePath:string = "";

  constructor(private services:SharedService) { }

  ngOnInit(): void {
    this.services.getTeacherList().subscribe((data:any)=>{
      this.teacherList = data;
    });
    this.PhotoFilePath = this.services.PhotoUrl;
  }

  getSex(sex:string):string{
    if(sex == "K") return "Kobieta";
    else if(sex == "M") return "Mężczyzna";
    else return "Nieokreślono";
  }

  getPosition(){
    const user = JSON.parse(localStorage.getItem("userInfo"));
    return user.position;
  }

  getValue(teacher:string){
    if(teacher == "") return true;
    else return false;
  }
}
