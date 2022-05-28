import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { id } from 'date-fns/locale';
import { AppComponent } from 'src/app/app.component';
import { Meet } from 'src/app/model/meeting';
import { SharedService } from 'src/app/services/shared.service';
import { MeetingComponent } from '../../meeting.component';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {
  
  userListActive: Meet[] = [];
  userListUnactive: Meet[] = [];
  historyList: Meet[] = [];
  studentList: any[] =[];
  information:Meet;
  timeNow:Date;
  timeList:Date;
  active:number = 0;
  searchText:string = '';
  constructor(private service:SharedService, private show:MeetingComponent,config: NgbModalConfig, private modal: NgbModal, private main:AppComponent) {
    config.backdrop = 'static';
    config.keyboard = false;
   }

  ngOnInit(): void {
    this.refreshScheduler(this.getUserPart('position'));
  }

  refreshScheduler(position:string){
    this.timeNow = new Date();
    if(position == 'T'){
      this.service.getMeetingTeacher(this.getUserPart('id')).subscribe((data:any)=>{
        data.forEach(item => {
          this.timeList = new Date(item.year, (item.month-1), item.day, item.hourEnd, item.minutesEnd);
          if(this.timeNow <= this.timeList){
            if(item.isAccepted)
              this.userListActive.push(item);
            else
              this.userListUnactive.push(item);
          }
          else
            this.historyList.push(item);
        });
      })
    }
    else if(position == 'S'){
      this.service.getMeetingStudent(this.getUserPart('id')).subscribe((data:any)=>{
        data.forEach(item => {
          this.timeList = new Date(item.year, (item.month-1), item.day, item.hourEnd, item.minutesEnd);
          if(this.timeNow <= this.timeList){
            if(item.isAccepted)
              this.userListActive.push(item);
            else
              this.userListUnactive.push(item);
          }
          else
            this.historyList.push(item);
        });
      })
    }
  }

  deleteTab(){
    this.userListActive.splice(0,this.userListActive.length);
    this.userListUnactive.splice(0,this.userListUnactive.length);
    this.historyList.splice(0,this.historyList.length);
  }

  selectScreen(screen:number){
      let bodyOne = document.getElementById('bodyOne');
      let bodySecond = document.getElementById('bodySecond');
      let bodyThird = document.getElementById('bodyThird');
      let emptyOne = document.getElementById('empty-one');
      let emptySecond = document.getElementById('empty-second');
      let emptyThird = document.getElementById('empty-third');
      let radius = document.getElementById('header-title-last');
        bodyOne.style.display = "none";
        bodySecond.style.display = "none";
        bodyThird.style.display = "none";
        emptyOne.style.display = "none";
        emptySecond.style.display = "none";
        emptyThird.style.display = "none";
        radius.style.borderBottomLeftRadius = "8px";
        radius.style.borderBottomRightRadius = "8px";

    if(screen == 1){
      if(this.userListActive.length == 0) emptyOne.style.display = "block";
      else bodyOne.style.display = "block";
      this.active = 1;
    }
    else if(screen == 2){
      if(this.userListUnactive.length == 0) emptySecond.style.display = "block";
      else bodySecond.style.display = "block";
      this.active = 2;
    }else if(screen == 3){
      if(this.historyList.length == 0){
        emptyThird.style.display = "block";
        radius.style.borderBottomLeftRadius = "0px";
        radius.style.borderBottomRightRadius = "0px";
      } 
      else{
        bodyThird.style.display = "block";
        radius.style.borderBottomLeftRadius = "0px";
        radius.style.borderBottomRightRadius = "0px";
      }
      this.active = 3;
    }

  }

  getUserPart(name:string){
    const user = JSON.parse(localStorage.getItem("userInfo"));
    switch(name){
      case 'position':
        return user.position;
      case 'id':
        return user.id;
      default:
        alert("Błąd danych");
        return null;
    }
    
  }

  getDateToDocument(y:number,m:number,d:number,hS:number,hE:number,mS:number,mE:number){
    let day;
    let month;
    let hourStart;
    let hourEnd;
    let minuteEnd;
    let minuteStart;
    if(d<10) day = "0" + d;
    else day = "" + d;
    if(m<10) month = "0" + m;
    else month = "" + m;
    if(hS<10) hourStart = "0" + hS;
    else hourStart = "" + hS;
    if(hE<10) hourEnd = "0" + hE;
    else hourEnd = "" + hE;
    if(mS<10) minuteStart = "0" + mS;
    else minuteStart = "" + mS;
    if(mE<10) minuteEnd = "0" + mE;
    else minuteEnd = "" + mE;
    return "Data: "+y+"-"+month+"-"+day+" "+hourStart+":"+minuteStart+"-"+hourEnd+":"+minuteEnd
  }

  openModal(content: any, meet:any){
    this.information = meet;
    this.service.studentList(meet.id).subscribe((data:any)=>{
      this.studentList = data
    })
    this.modal.open(content, { centered: true, size: 'm' });
  }

  changeAccepted(id:any, status:string){
    this.service.changeAccepted(id).subscribe((data:any)=>{
      if(data.responseCode == 1){
        if(this.userListActive.length == 1 || this.userListUnactive.length == 1 || this.historyList.length == 1) window.location.reload();
        if(status == 'add') this.main.setMessage("Pomyślnie zaakceptowano spotkanie",'good'); 
        else if(status == 'delete') this.main.setMessage("Odrzucono spotkanie",'bad');
        this.deleteTab();
        this.refreshScheduler(this.getUserPart('position'));
      }
      else if(data.responseCode == 2)
        this.main.setMessage("Nie odnaleziono spotkania",'bad');
      else alert("Błąd bazy");
    })
  }


}
