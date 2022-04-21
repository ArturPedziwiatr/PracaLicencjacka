import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Student } from 'src/app/model/studentDto';
import { Teacher } from 'src/app/model/teacherDto';
import { SharedService } from 'src/app/services/shared.service';
import { MeetingComponent } from '../meeting.component';

@Component({
  selector: 'app-add-meet',
  templateUrl: './add-meet.component.html',
  styleUrls: ['./add-meet.component.css']
})
export class AddMeetComponent implements OnInit {

  constructor(private service: SharedService,private formBuilder:FormBuilder, private show:MeetingComponent) { }
  studentList:Array<Student> = [];
  teacherList:Array<Teacher> = [];
  idList = new Array<Student>();
  userPosition:string="";
  screen:number = 0;
  idUser:number;
  dateStart:string;
  dateEnd:string;
  delete:number;

  public meetingForm = this.formBuilder.group({
    title:['',[
      Validators.required,
      Validators.pattern("[a-zA-Ząęóżźćś ]*"),
      Validators.maxLength(50)
    ]],
    description:['',[
      Validators.required,
      Validators.maxLength(500)
    ]],
    date:['',[
      Validators.required
    ]],
    timeStart:['',[
      Validators.required
    ]],
    timeEnd:['',[
      Validators.required
    ]],
  })

  ngOnInit(): void {
    this.service.getTeacherList().subscribe((data:any)=>{
      this.teacherList = data;
    });
    this.service.getStudentList().subscribe((data:any)=>{
      this.studentList = data;
    });
    this.userPosition = this.getPosition();
  }

  addTeacher(id:any){
    this.idUser = id;
    this.nextScreen();
  }

  addStudent(item:any){
    this.idList.push(item);
    this.studentList = this.studentList.filter(e => e.id!==item.id);
  }

  addMeetingS(){
    var dateStart = this.meetingForm.controls["date"].value.toString() + "T" + this.meetingForm.controls["timeStart"].value.toString() + ":00.000Z";
    var dateEnd  =  this.meetingForm.controls["date"].value.toString() + "T" + this.meetingForm.controls["timeEnd"].value.toString() + ":00.000Z";

    this.service.addMeet(
      this.idUser,this.getId(),this.meetingForm.controls["title"].value,this.meetingForm.controls["description"].value,dateStart,dateEnd
    ).subscribe((data:any)=>{
      if(data.responseCode == 1){
        this.show.ngOnInit();
        alert("działa");
      }
      else if(data.responseCode == 2){
        alert(data.responseMessage);
      }
    })
  }

  addMeetingT(){
    var dateStart = this.meetingForm.controls["date"].value.toString() + "T" + this.meetingForm.controls["timeStart"].value.toString() + ":00.000Z";
    var dateEnd  =  this.meetingForm.controls["date"].value.toString() + "T" + this.meetingForm.controls["timeEnd"].value.toString() + ":00.000Z";
    var result = true;
    var counter = 0;

    for(let list of this.idList){
      this.service.addMeet(
        this.getId(),list.id,this.meetingForm.controls["title"].value,this.meetingForm.controls["description"].value,dateStart,dateEnd
      ).subscribe((data:any)=>{
        if(data.responseCode == 2)
          result = false;
          counter;
      })
    }

    if(!result) alert("Nie udało się stworzyć tyle spotkań:  " + counter);
    else this.show.ngOnInit();
  }

  nextScreen(){if(this.screen<1)this.screen ++;}
  prevScreen(){if(this.screen>0)this.screen --;}

  getPosition(){
    const user = JSON.parse(localStorage.getItem("userInfo"));
    return user.position;
  }

  getId(){
    const user = JSON.parse(localStorage.getItem("userInfo"));
    return user.id;
  }
}
