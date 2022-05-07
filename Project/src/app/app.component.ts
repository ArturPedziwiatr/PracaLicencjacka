import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from './auth/constants';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['app.component.css'],
})
export class AppComponent implements OnInit{
  title = 'Edziekanat';
  ModalTitle: string = 'Zaloguj się';
  textMessage:string = '';

  constructor(private route:Router ) { 
  }
  ngOnInit(): void {
  }

  logger(){
    document.getElementById('logger').style.display="block";
    document.getElementById('btnSignIn').style.display="none";
  }

  closeLogger(){
    document.getElementById('logger').style.display="none";
    document.getElementById('btnSignIn').style.display="block";
  }

  logOut(){ 
    localStorage.removeItem(Constants.USER_KEY);
    this.route.navigate(['home']);
    window.location.reload();
  }

  get isUserLogin(){
    const user = localStorage.getItem(Constants.USER_KEY)
    return user && user.length>0;
  }

  setMessage(msg:string, status:string){
    this.textMessage = msg;
    if(status == 'good') 
      var showAddSucces = document.getElementById('update-success');
    else if(status == 'bad')  
      var showAddSucces = document.getElementById('update-fail');
    
      if(showAddSucces){
        showAddSucces.style.display = "block";
      }
      setTimeout(function(){
        if(showAddSucces){
          showAddSucces.style.display = "none";
        }
      }, 3000);
    
  }

}
