import {Component,OnInit,ChangeDetectionStrategy,ViewEncapsulation, ChangeDetectorRef, Input} from '@angular/core';
import { CalendarEvent, CalendarView} from 'angular-calendar';
import { Meet } from 'src/app/model/meeting';
import { SharedService } from 'src/app/services/shared.service';
import { Show } from 'src/app/model/showMeet';


@Component({
  selector: 'app-show-meeting',
  template: `
    <div class="row">
      <div class="col-md-6">
        <div class="btn-group">
          <div
            class="btn btn-primary"
            mwlCalendarPreviousView
            [view]="'week'"
            [(viewDate)]="viewDate"
          >
            Poprzedni
          </div>
          <div
            class="btn btn-outline-secondary"
            mwlCalendarToday
            [(viewDate)]="viewDate"
          >
            Aktualny
          </div>
          <div
            class="btn btn-primary"
            mwlCalendarNextView
            [view]="'week'"
            [(viewDate)]="viewDate"
          >
            Następny
          </div>
        </div>
      </div>
    </div>
    <br />

    <mwl-calendar-week-view
      [viewDate]="viewDate"
      [events]="events"
      [excludeDays]="excludeDays"
      [hourSegments]="1"
    >
    </mwl-calendar-week-view>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styles: []
})

export class ShowMeetingComponent implements OnInit {

  view: CalendarView = CalendarView.Week;
  events: CalendarEvent[] = [];
  viewDate: Date = new Date();
  excludeDays: number[] = [0, 6];
  CalendarView = CalendarView;
  meetList: Meet[] = [];
  @Input() showUser:Show;


  constructor(private service:SharedService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if(this.showUser.Position == "T")
      this.service.getMeetingTeacher(this.showUser.Id).subscribe((date:any)=>{
        this.meetList = date; 
        this.getEvents();  
      });
    else
      this.service.getMeetingStudent(this.showUser.Id).subscribe((date:any)=>{
        this.meetList = date; 
        this.getEvents();  
      });
  }

  getEvents(){
    for(let meet of this.meetList ){
      var event = {
        id: this.events.length,
        title: meet.title,
        start: new Date(meet.year,(meet.month-1),meet.day,meet.hourStart,meet.minutesStart),
        end: new Date(meet.year,(meet.month)-1,meet.day,meet.hourEnd,meet.minutesEnd),
      };

      this.events = [...this.events, event];
    }

    this.refresh();
  }

  private refresh() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }

}
