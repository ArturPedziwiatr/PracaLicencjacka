import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Constants } from './auth/constants';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['app.component.css'],
})
export class AppComponent implements OnInit{
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
