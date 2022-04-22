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

  constructor(private services:SharedService) { }

  ngOnInit(): void {
    this.services.getStudentList().subscribe((data:any)=>{
      this.studentList = data;
    });
  }

}
