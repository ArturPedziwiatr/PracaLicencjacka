import { Component,  OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {
  constructor(private service: SharedService, private router:Router) { 
  }

  active:number = 1;
  ngOnInit(): void {
  }

  getPosition(){
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if(user == null) return 'U';
    return user.position;
  }

  ifAdmin(){
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if(user == null) return false;
    return user.isAdmin;
  }

  changeSide(side:string){
    switch(side){
      case 'home':
        this.active = 1;
        break;
      case 'setting':
        this.active = 2;
        break;
      case 'student':
        this.active = 3;
        break;
      case 'teacher':
        this.active = 4;
        break;
      case 'users':
        this.active = 5;
        break;
      case 'meeting':
        this.active = 6;
        break;
      case 'plagiat':
        this.active = 7;
        break;
      default:
        alert("Błąd danych");
        break;
    }
    this.router.navigate([side]);
  }

  
}
