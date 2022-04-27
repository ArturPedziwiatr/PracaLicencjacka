import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Teacher } from 'src/app/model/teacherDto';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {

  PhotoFilePath:string = 'https://localhost:7012/Photos/undefinded.png';
  photoFile:string = 'undefinded.png';
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

  constructor(private formBuilder:FormBuilder, private service:SharedService) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("userInfo"));
    if(this.user.position == "T")
    {
      this.getTeacher(this.user.id);
    }
    else
      this.getUser(this.user.id); 
  }

  getUser(id:number){
    this.service.getUserId(id).subscribe((dataU:any)=>{
      if(dataU.responseCode == 1)
      {
        this.PhotoFilePath = this.service.PhotoUrl + dataU.dateSet.photoFile;
        this.setValue(this.user.position, dataU.dateSet);
      }
      else {
        alert("Problem z bazą użytkownika");
        return null;
      }
    })
  }

  getTeacher(id:number){
    this.service.getTeacherSetting(id).subscribe((dataT:any)=>{
        if(dataT.responseCode == 1)
        {
          this.PhotoFilePath = this.service.PhotoUrl + dataT.dateSet.photoFile;
          this.setValue(this.user.position, dataT.dateSet);
        }
        else {
          alert("Problem z bazą użytkownika");
          return null;
        }
    });
  }

  setValue(position:string, model:any){
    if(position == "T"){
      this.userForm.get('title').setValue(model.title);
      this.userForm.get('description').setValue(model.description);
      this.userForm.get('phone').setValue(model.phone);
      this.userForm.get('side').setValue(model.side);
      this.id = model.idTeacher;
    }
    this.userForm.get('firstName').setValue(model.firstName);
    this.userForm.get('lastName').setValue(model.lastName);
    this.userForm.get('email').setValue(model.email);
    this.userForm.get('sex').setValue(model.sex);
    this.passwordForm.get('password').setValue("");
    this.passwordForm.get('passwordOld').setValue("");
    this.passwordForm.get('passwordSecond').setValue("");
    this.passwordForm.get('passwordOldSecond').setValue("");
  }

  uploadPhoto(event:any){
    var file = event.target.files[0];
    const formData:FormData = new FormData();
    formData.append('uploadedFile',file,file.name);

    this.service.UploadPhoto(formData).subscribe((data:any)=>{
      if(data.responseCode == 1){
        this.photoFile = data.dateSet;
        this.changePhoto();
        this.ngOnInit();
      }
      else if(data.responseCode == 2) alert(data.responseMessage);
      else alert("Błąd bazy");
    });
  }

  changePhoto(){
      this.service.changePhoto(this.user.id, this.photoFile).subscribe((dataPhoto:any)=>{
        console.log(dataPhoto);
        if(dataPhoto.responseCode == 1){
          this.textMessage = "Pomyślnie zaktualizowano zdjęcie"
          var showAddSucces = document.getElementById('update-success');
            if(showAddSucces){
              showAddSucces.style.display = "block";
            }
            setTimeout(function(){
              if(showAddSucces){
                showAddSucces.style.display = "none";
              }
            }, 3000);
        }
        else if(dataPhoto.responseCode == 2){
          this.textMessage = dataPhoto.responseMessage;
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
        else alert("Błąd systemu");

        this.ngOnInit();
      })
  }

  editUser(){
    const body={
      photoFile:this.user.photoFile,
      firstName:this.userForm.controls["firstName"].value,
      lastName:this.userForm.controls["lastName"].value,
      pesel:this.user.pesel,
      sex:this.userForm.controls["sex"].value,
      email:this.user.email,
      idCard:this.user.idCard,
      password:""
    }
    this.service.updateUser(this.user.id, body).subscribe((data:any)=>{
      if(data.responseCode == 1){
        this.textMessage = "Pomyślnie zaktualizowano dane podstawowe"
        var showAddSucces = document.getElementById('update-success');
          if(showAddSucces){
            showAddSucces.style.display = "block";
          }
          setTimeout(function(){
            if(showAddSucces){
              showAddSucces.style.display = "none";
            }
          }, 3000);
      }
      else if(data.responseCode == 2){
        this.textMessage = data.textMessage;
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
      else alert("Błąd systemu");
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
      if(data.responseCode == 1){
        this.textMessage = "Pomyślnie zaktualizowano dane rozszerzone"
        var showAddSucces = document.getElementById('update-success');
          if(showAddSucces){
            showAddSucces.style.display = "block";
          }
          setTimeout(function(){
            if(showAddSucces){
              showAddSucces.style.display = "none";
            }
          }, 3000);
      }
      else if(data.responseCode == 2){
        this.textMessage = data.textMessage;
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
      else alert("Błąd systemu");
    })
  }

  changePassword(){
    const body={
      oldPassword:this.passwordForm.controls["passwordOld"].value,
      newPassword:this.passwordForm.controls["password"].value
    }
      this.service.changePassword(this.user.id, body).subscribe((data:any)=>{
        if(data.responseCode == 1){
          this.textMessage = "Pomyślnie zaktualizowano hasło"
          var showAddSucces = document.getElementById('update-success');
            if(showAddSucces){
              showAddSucces.style.display = "block";
            }
            setTimeout(function(){
              if(showAddSucces){
                showAddSucces.style.display = "none";
              }
            }, 3000);
        }
        else if(data.responseCode == 2){
          this.textMessage = data.textMessage;
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
        else alert("Błąd systemu");
      })
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
