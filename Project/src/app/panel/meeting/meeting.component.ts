import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent } from 'angular-calendar';
import { Meet } from 'src/app/model/meeting';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit {

  @Input() viewDate: Date;
  @Input() events: CalendarEvent[] = [];

  closeResult: string='';
  constructor(config: NgbModalConfig, private modal: NgbModal, private service: SharedService) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  meetingList:Meet[]=[];
  modalTitle: string = '';
  textMessage:string = '';

  ngOnInit(): void {
    this.modal.dismissAll();
    this.service.getMeetingList().subscribe((data:any)=>{
      this.meetingList = data;
    });
  }


  addMeeting(content: any){
    this.modal.open(content, { centered: true, size: 'xl' });
    this.modalTitle = "Dodaj spotkanie";
  }


  setTextMessage(message:string){this.textMessage = message;}
}
