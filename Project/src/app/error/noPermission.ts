import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from '../auth/constants';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-noPermission',
  template: `
     <div>
        <div class="iconNoPermission">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="currentColor" class="bi bi-clipboard2-x" viewBox="0 0 16 16">
                <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5h3Z"/>
                <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-12Z"/>
                <path d="M8 8.293 6.854 7.146a.5.5 0 1 0-.708.708L7.293 9l-1.147 1.146a.5.5 0 0 0 .708.708L8 9.707l1.146 1.147a.5.5 0 0 0 .708-.708L8.707 9l1.147-1.146a.5.5 0 0 0-.708-.708L8 8.293Z"/>
            </svg>
        </div>
        <div class="titleNoPermision">
            <a>BRAK POZWOLENIA</a>
            <h1>Wygląda na to że nie masz uprawnień do odwiedzenia tej strony.</h1>
        <div>
        <div class="loginBox">
            <div class="card" style="width: 100%;">
                <div class="card-body">
                    <app-sign-in></app-sign-in>
                </div>
            </div>
        </div>
     </div> 
  `,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['apperror.component.css'], 
})
export class NoPermissionComponent implements OnInit{
  title = 'Edziekanat';
  ModalTitle: string = 'Zaloguj się';
  logger:any;

  constructor(config: NgbModalConfig, private modalService: NgbModal, private service: SharedService) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }
  ngOnInit(): void {
  }

  logIn(content: any){
    this.modalService.open(content, { centered: true, windowClass: 'dark-modal' });
  }

  logOut(){
    localStorage.removeItem(Constants.USER_KEY);

  }

  get isUserLogin(){
    const user = localStorage.getItem(Constants.USER_KEY)
    return user && user.length>0;
  }
}