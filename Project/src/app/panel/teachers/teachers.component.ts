import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
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
  information:any;
  PhotoFilePath:string = "";

  constructor(private services:SharedService,config: NgbModalConfig, private modal: NgbModal) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.modal.dismissAll();
    this.services.getTeacherList().subscribe((data:any)=>{
      this.teacherList = data;
    });
    this.PhotoFilePath = this.services.PhotoUrl;
  }

  watchProfile(content:any, teacher:any){
    this.information = teacher;
    this.modal.open(content, { centered: true, size: 'l' });
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
