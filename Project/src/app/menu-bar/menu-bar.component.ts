import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {

  constructor(private service: SharedService) { }

  ngOnInit(): void {
  }

  getPosition(){
    const user = JSON.parse(localStorage.getItem("userInfo"));
    return user.position;
  }

  /*getChecked(){
    var showAddSucces = document.getElementById('buttonSetting');
    if(showAddSucces.isActive){

    }
    let listNav = document.querySelectorAll('.nav li');
    function active(){
      listNav.forEach((itemlist)=>
      itemlist.classList.remove('hovered'));
      this.classList.add('hovered');
    }
    listNav.forEach((itemlist) =>
    itemlist.addEventListener('mouseover',active))
  }*/
}
