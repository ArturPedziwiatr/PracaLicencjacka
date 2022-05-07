import { Component, OnInit} from '@angular/core';
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
  constructor( private service: SharedService,private formBuilder:FormBuilder,private router:Router) { 
  }
  
  public signForm = this.formBuilder.group({
    email:['',[ 
      Validators.required,
      Validators.maxLength(50)
    ]],
    password:['',[
      Validators.maxLength(50),
      Validators.minLength(6),
      Validators.required
    ]]
  })
  
  ngOnInit(): void {
  }
  
  onSubmit(){
      var email=this.signForm.controls["email"].value;
      var password=this.signForm.controls["password"].value;
    this.service.login(email,password).subscribe((data:any)=>{

      if(data.responseCode == 1){
        localStorage.setItem(Constants.USER_KEY, JSON.stringify(data.dateSet));
        this.router.navigate(["home"]);
      }
      else if (data.responseCode == 2){
        alert("Nie znaleziono uzytkownika");
      }
    })
  }

  change(){
    alert(this.signForm.controls["email"].value);
  }
}
