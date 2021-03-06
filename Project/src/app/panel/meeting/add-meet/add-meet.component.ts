import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { id } from 'date-fns/locale';
import { AppComponent } from 'src/app/app.component';
import { Show } from 'src/app/model/showMeet';
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

  constructor(private service: SharedService,private formBuilder:FormBuilder, private show:MeetingComponent, private main:AppComponent) { }
  studentList:Array<Student> = [];
  teacherList:Array<Teacher> = [];
  secondList = new Array<Student>();
  idList:string[] = [];
  userPosition:string="";
  screen:number = 0;
  idUser:string;
  dateStart:string;
  dateEnd:string;
  delete:number;
  showUser:Show;
  searchText:string='';

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
    this.showUser = new Show(this.getId(),this.getPosition());
    this.service.getTeacherList().subscribe((data:any)=>{
      this.teacherList = data;
    });
    this.service.getStudentList().subscribe((data:any)=>{
      this.studentList = data;
    });
    this.userPosition = this.getPosition();
  }

  addTeacher(id:any){
    this.showUser = new Show(id,"T");
    this.idUser = id;
    this.nextScreen();
  }

  addStudent(item:any){
    this.secondList.push(item);
    this.studentList = this.studentList.filter(e => e.id!==item.id);
  }

  deleteStudent(item:any){
    this.studentList.push(item);
    this.secondList = this.secondList.filter(e => e.id!==item.id);
  }

  addMeetingS(){
    var dateStart = this.meetingForm.controls["date"].value.toString() + "T" + this.meetingForm.controls["timeStart"].value.toString() + ":00.000Z";
    var dateEnd  =  this.meetingForm.controls["date"].value.toString() + "T" + this.meetingForm.controls["timeEnd"].value.toString() + ":00.000Z";
    this.idList.push(this.getId());

    this.service.addMeet(this.idUser,this.meetingForm.controls["title"].value,this.meetingForm.controls["description"].value,dateStart,dateEnd,false).subscribe((data:any)=>{
      if(data.responseCode == 1){
        this.service.addConnector(this.idUser,this.idList,data.dateSet).subscribe((res:any)=>{
          if(res.responseCode == 1){
            this.show.ngOnInit();
            this.main.setMessage("Pomyślnie poproszono o spotkanie",'good'); 
          }
          else if(res.responseCode == 2)
            this.main.setMessage("Prośba o spotkanie nie została utworzona",'bad'); 
          else alert("Błąd bazy");
        })
      }
      else if(data.responseCode == 2)
        this.main.setMessage(data.responseMesage,'bad');
    })
  }

  addMeetingT(){
    var dateStart = this.meetingForm.controls["date"].value.toString() + "T" + this.meetingForm.controls["timeStart"].value.toString() + ":00.000Z";
    var dateEnd  =  this.meetingForm.controls["date"].value.toString() + "T" + this.meetingForm.controls["timeEnd"].value.toString() + ":00.000Z";

    for(let list of this.secondList){
      this.idList.push(list.id);
    }
      this.service.addMeet(this.getId(),this.meetingForm.controls["title"].value,this.meetingForm.controls["description"].value,dateStart,dateEnd,true).subscribe((data:any)=>{
        if(data.responseCode == 1){
          this.service.addConnector(this.getId(),this.idList,data.dateSet).subscribe((res:any)=>{
            if(res.responseCode == 1){
              this.show.ngOnInit();
              this.main.setMessage("Spotkanie zostało utworzone",'good');
            }
            else if(res.responseCode == 2)
              this.main.setMessage("Spotkanie nie zostało utworzone",'bad');
            else alert("Błąd bazy");
          })
        }
        else if(data.responseCode == 2)
          this.main.setMessage(data.responseMesage,'bad');
      })
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

  validators(name:string){
    if(this.meetingForm.controls[name].invalid) return true
    switch(name){
      case 'date':
        if(this.checkDate()) return true;
        break;
      case 'timeStart':
        if(this.checkTime("timeStart")) return true;
        break;
      case 'timeEnd':
        if(this.checkTime("timeEnd")) return true;
        break;
    }
    return false
  }

  checkDate(){
    let today = new Date().toISOString().substring(0,10);
    if(this.meetingForm.controls["date"].value.toString() < today) return true
    else return false;
  }

  checkTime(name:string){
    let date = new Date().toISOString().substring(0,10);
    let time = new Date().toTimeString().substring(0,5);

    if(name=="timeEnd")
      if(this.meetingForm.controls["timeStart"].value >= this.meetingForm.controls["timeEnd"].value) return true;
    if(this.meetingForm.controls["date"].value.toString() < date) return true
    else if(this.meetingForm.controls["date"].value.toString() == date)
      if(this.meetingForm.controls[name].value.toString() < time) return true

    return false;
  }

  ifDisabled(){
    if(!this.meetingForm.valid) return true;
    else if(this.checkDate()) return true
    else if(this.checkTime("timeStart")) return true;
    else if(this.checkTime("timeEnd")) return true;
    else return false
  }
}
