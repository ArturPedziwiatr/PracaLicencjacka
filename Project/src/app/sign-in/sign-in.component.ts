import { Component, OnInit} from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/services/shared.service';
import { FormBuilder, Validators,} from '@angular/forms';
import { Constants } from '../auth/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  public loginForm = this.formBuilder.group({
    email:['',[ 
      Validators.required,
      Validators.email]],
    password:['',[
      Validators.minLength(6),
      Validators.required]]
  })

  constructor(config: NgbModalConfig, private modal: NgbModal, 
                private service: SharedService,
                private formBuilder:FormBuilder,
                private router:Router) { 
      config.backdrop = 'static';
      config.keyboard = false;
  }
  
  
  ngOnInit(): void {
  }
  
  onSubmit(){
    
      var email=this.loginForm.controls["email"].value;
      var password=this.loginForm.controls["password"].value;
    this.service.login(email,password).subscribe((data:any)=>{

      if(data.responseCode == 1){
        localStorage.setItem(Constants.USER_KEY, JSON.stringify(data.dateSet));
        this.modal.dismissAll();
        this.router.navigate(["home"]);
      }
      else if (data.responseCode == 2){
        alert("Nie znaleziono uzytkownika");
      }
    })
  }

}
