import { Component, OnInit } from '@angular/core';
import { Student } from 'src/app/model/studentDto';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {
  
  studentList:Student[] = [];
  PhotoFilePath:string = "";
  searchText:string='';

  constructor(private services:SharedService) { }

  ngOnInit(): void {
    this.services.getStudentList().subscribe((data:any)=>{
      this.studentList = data;
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
}
