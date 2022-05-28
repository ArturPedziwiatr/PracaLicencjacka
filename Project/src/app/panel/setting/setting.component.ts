import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { Constants } from 'src/app/auth/constants';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  PhotoFilePath:string = '';
  photoFile:string = 'undefinded.png';
  teacher:any;
  user:any;
  id:any;
  textMessage:string = "";

  public userForm = this.formBuilder.group({
    firstName:['',[
      Validators.required,
      Validators.pattern("[a-zA-Ząęóżźćś ]*"),
      Validators.maxLength(30)
    ]],
    lastName:['',[
      Validators.minLength(3),
      Validators.pattern("[a-zA-Ząęóżźćś ]*"),
      Validators.maxLength(40)
    ]],
    sex:['',[
      Validators.required,
      Validators.maxLength(1),
    ]],
    email:['',[
      Validators.required,
      Validators.email,
    ]],
    title:['',[]],
    description:['',[
      Validators.maxLength(500)
    ]],
    phone:['',[
      Validators.minLength(9),
      Validators.maxLength(9),
      Validators.pattern("[0-9]*"),
    ]],
    side:['',[
      Validators.minLength(4)
    ]]
  })

  public passwordForm = this.formBuilder.group({
    passwordOld:['',[
      Validators.required,
      Validators.minLength(6)
    ]],
    password:['',[
      Validators.required,
      Validators.minLength(6)
    ]],
    passwordOldSecond:['',[
      Validators.required,
      Validators.minLength(6)
    ]],
    passwordSecond:['',[
      Validators.required,
      Validators.minLength(6)
    ]],
  });  

  constructor(private formBuilder:FormBuilder, private service:SharedService, private main:AppComponent) { }

  ngOnInit(): void {
    this.PhotoFilePath = this.service.PhotoUrl;
    this.user = JSON.parse(localStorage.getItem("userInfo"));

    this.photoFile = this.user.photoFile;
    this.userForm.get('firstName').setValue(this.user.firstName);
    this.userForm.get('lastName').setValue(this.user.lastName);
    this.userForm.get('email').setValue(this.user.email);
    this.userForm.get('sex').setValue(this.user.sex);
    this.passwordForm.get('password').setValue("");
    this.passwordForm.get('passwordOld').setValue("");
    this.passwordForm.get('passwordSecond').setValue("");
    this.passwordForm.get('passwordOldSecond').setValue("");

    if(this.user.position == "T")
      this.getTeacher(this.user.id);
    
  }

  getTeacher(id:number){
    this.service.getTeacherSetting(id).subscribe((data:any)=>{
        if(data.responseCode == 1)
        {
          this.teacher = data.dateSet;
          this.setValue();
        }
        else 
          alert("Problem z bazą użytkownika");
    });
  }

  setValue(){
      this.userForm.get('title').setValue(this.teacher.title);
      this.userForm.get('description').setValue(this.teacher.description);
      this.userForm.get('phone').setValue(this.teacher.phone);
      this.userForm.get('side').setValue(this.teacher.side);
      this.id = this.teacher.idTeacher;
  }

  uploadPhoto(event:any){
    var file = event.target.files[0];
    const formData:FormData = new FormData();
    formData.append('uploadedFile',file,file.name);

    this.service.UploadPhoto(formData).subscribe((data:any)=>{
      if(data.responseCode == 1){
        this.photoFile = data.dateSet;
        this.changePhoto();
      }
      else if(data.responseCode == 2) alert(data.responseMessage);
      else alert("Błąd bazy");
    });
  }

  changePhoto(){
      this.service.changePhoto(this.user.id, this.photoFile).subscribe((dataPhoto:any)=>{
        if(dataPhoto.responseCode == 1){
          this.main.setMessage('Pomyślnie zaktualizowano zdjęcie','good');
          this.relogUser(this.user.id);
        }
        else if(dataPhoto.responseCode == 2)
          this.main.setMessage('Nie zaktualizowano zdjęcia','bad');
        else alert("Błąd systemu");

        window.location.reload();
      })
  }

  editUser(){
    var user = {
      firstName:this.userForm.controls["firstName"].value,
      lastName:this.userForm.controls["lastName"].value,
      email:this.userForm.controls["email"].value,
      sex:this.userForm.controls["sex"].value,
      }

      this.service.updateBasicUser(this.user.id,user).subscribe((res:any) =>{
        if(res.responseCode == 1)
        {
          this.main.setMessage('Pomyślnie zaktualizowano dane podstawowe','good');
          this.relogUser(this.user.id);
        }
        else
          this.main.setMessage('Aktualizowanie danych nie powiodło się','bad');
      }) 
  }

  relogUser(id:any){
    this.service.getUserId(this.user.id).subscribe((data:any)=>{
      if(data.responseCode == 1)
        localStorage.setItem(Constants.USER_KEY, JSON.stringify(data.dateSet));
      else if(data.responseCode == 2)
        this.main.setMessage('Błąd wymiany danych. Nastąpiło wylogowanie użytkownika','bad');
    })
  }

  editTeacher(){
    const body={
      title:this.userForm.controls["title"].value,
      phone:this.userForm.controls["phone"].value,
      side:this.userForm.controls["side"].value,
      description:this.userForm.controls["description"].value
    }
    this.service.updateTeacher(this.id, body).subscribe((data:any)=>{
      if(data.responseCode == 1)
        this.main.setMessage('Pomyślnie zaktualizowano dane rozszerzone','good');
      else if(data.responseCode == 2)
        this.main.setMessage('Nie zaktualizowano danych rozszerzonych','bad');
      else alert("Błąd systemu");
    })
  }

  changePassword(){
    const body={
      oldPassword:this.passwordForm.controls["passwordOld"].value,
      newPassword:this.passwordForm.controls["password"].value
    }
      this.service.changePassword(this.user.id, body).subscribe((data:any)=>{
        if(data.responseCode == 1)
          this.main.setMessage('Pomyślnie zaktualizowano hasło','good');
        else if(data.responseCode == 2)
          this.main.setMessage(data.textMessage,'bad');
        else alert("Błąd systemu");
      })
  }

  validators(name:string){
    switch(name){
      case 'firstName':
        if(this.userForm.controls[name].invalid) return true
        break;
      case 'lastName':
        if(this.userForm.controls[name].invalid) return true
        break;
      case 'email':
        if(this.userForm.controls[name].invalid) return true
        break;
      case 'passwordSecond':
        if(this.passwordForm.controls[name].invalid) return true
        if(this.strong(this.passwordForm.controls[name].value)) return true;
        break;
      case 'password':
        if(this.passwordForm.controls[name].invalid) return true
        if(this.strong(this.passwordForm.controls[name].value)) return true;
        break;
    }
    return false
  }

  strong(paswd:string){
    let number = false;
    let big = false;
    let small = false;
    if(paswd == "") return false;
    for(let i=0; i<paswd.length; i++){
      if(paswd[i] >= '0' && paswd[i] <= '9') number = true;
      if(paswd[i] >= 'A' && paswd[i] <= 'Z') big = true;
      if(paswd[i] >= 'a' && paswd[i] <= 'z') small = true;
    }
    if(number == false || big == false || small == false) return true;
    else return false;
  }

  isActive(){
    if(!this.passwordForm.valid) return false;
    else
      if(this.passwordForm.controls["passwordOld"].value != this.passwordForm.controls["passwordOldSecond"].value) return false;
      else
        if(this.passwordForm.controls["password"].value != this.passwordForm.controls["passwordSecond"].value) return false;
        else return true;
  }
}
