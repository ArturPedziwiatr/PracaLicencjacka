import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { SharedService } from 'src/app/services/shared.service';
import { UsersComponent } from '../users.component';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  @Input() usr:any;
  @Input() status:any;
  photoFile:string = 'undefinded.png';
  PhotoFilePath:string = '';
  statusEdit:number=0;

  public registerForm = this.formBuilder.group({
    firstName:['asddas',[
      Validators.required,
      Validators.pattern("[a-zA-ZąęóżźćśłŁńŃĄŚĆĘŻŹÓ ]*"),
      Validators.maxLength(30)
    ]],
    lastName:['',[
      Validators.minLength(6),
      Validators.pattern("[a-zA-ZąęóżźćśłŁńŃĄŚĆĘŻŹÓ ]*"),
      Validators.maxLength(60)
    ]],
    pesel:['',[
      Validators.required,
      Validators.pattern("[0-9]*"),
      Validators.maxLength(11),
      Validators.minLength(11)
    ]],
    sex:['',[
      Validators.required,
      Validators.maxLength(1),
    ]],
    email:['',[
      Validators.required,
      Validators.email,
    ]],
    idCard:['',[
      Validators.required,
      Validators.pattern("[0-9]*"),
      Validators.maxLength(6),
      Validators.minLength(6)
    ]],
    passwordR:['',[
      Validators.minLength(8)
    ]],
    password:['',[
      Validators.minLength(8)
    ]]
  })

  id: number|string = "";

  constructor(private service: SharedService, private show: UsersComponent, private main:AppComponent,private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.PhotoFilePath = this.service.PhotoUrl;
      if(this.statusEdit == 0){
        this.registerForm.get('firstName').setValue(this.usr.firstName);
        this.registerForm.get('lastName').setValue(this.usr.lastName);
        this.registerForm.get('email').setValue(this.usr.email);
        this.registerForm.get('pesel').setValue(this.usr.pesel);
        this.registerForm.get('sex').setValue(this.usr.sex);
        this.registerForm.get('idCard').setValue(this.usr.idCard);
        this.id = this.usr.id;
        if(this.status == 3)
          this.photoFile = this.usr.photoFile;
      }
      else
        this.statusEdit = 0;

  }

  uploadPhoto(event:any){
    var file = event.target.files[0];
    const formData:FormData = new FormData();
    formData.append('uploadedFile',file,file.name);

    this.service.UploadPhoto(formData).subscribe((data:any)=>{
      if(data.responseCode == 1){
        this.main.setMessage('Dodano zdjęcie do bazy','good');
        this.photoFile = data.dateSet;
        this.statusEdit=1;
        this.ngOnInit();
      }
      else if(data.responseCode == 2)
        this.main.setMessage(data.responseMesage,'bad');
      else alert("Błąd bazy");
    });
  }

  changePhoto(value:any){
    if( this.photoFile == "woman.png" ||  this.photoFile == "man.png" ||  this.photoFile == "undefinded.png"){
      if(value == "K") this.photoFile = "woman.png";
      else if(value == "M") this.photoFile = "man.png";
      else this.photoFile = "undefinded.png";
      this.statusEdit=1;
      this.ngOnInit();
    }      

  }

  addUser(){
    var user = {
      photoFile: this.photoFile,
      firstName:this.registerForm.controls["firstName"].value,
      lastName:this.registerForm.controls["lastName"].value,
      email:this.registerForm.controls["email"].value,
      pesel:this.registerForm.controls["pesel"].value,
      position:"S",
      sex:this.registerForm.controls["sex"].value,
      password:this.registerForm.controls["passwordR"].value,
      idCard:this.registerForm.controls["idCard"].value
    }
    this.service.addUser(user).subscribe((data:any)=>{
      if(data.responseCode == 1){
       this.show.ngOnInit();
       this.main.setMessage('Pomyślnie dodano studenta','good');
      }
      else if(data.responseCode == 2){
        this.main.setMessage(data.responseMesage,'bad');
      }
    });
    
  }

  addTeacher(){
    var user = {
      photoFile: this.photoFile,
      firstName:this.registerForm.controls["firstName"].value,
      lastName:this.registerForm.controls["lastName"].value,
      email:this.registerForm.controls["email"].value,
      pesel:this.registerForm.controls["pesel"].value,
      position:"T",
      sex:this.registerForm.controls["sex"].value,
      password:this.registerForm.controls["passwordR"].value,
      idCard:this.registerForm.controls["idCard"].value
    }

    this.service.addUser(user).subscribe((data:any) =>{
      if(data.responseCode ==1){
        this.show.ngOnInit();
        this.main.setMessage('Pomyślnie dodano pracownika','good');
      }else if(data.responseCode == 2){
        this.main.setMessage(data.responseMesage,'bad');
      }
      
    })
  }

  editUser(){
      var user = {
        photoFile:this.photoFile,
        firstName:this.registerForm.controls["firstName"].value,
        lastName:this.registerForm.controls["lastName"].value,
        email:this.registerForm.controls["email"].value,
        pesel:this.registerForm.controls["pesel"].value,
        position:this.usr.position,
        sex:this.registerForm.controls["sex"].value,
        password:this.registerForm.controls["password"].value,
        idCard:this.registerForm.controls["idCard"].value
        }

        this.service.updateUser(this.id,user).subscribe((res:any) =>{
          this.show.ngOnInit();
          if(res.responseCode == 1)
            this.main.setMessage('Pomyślnie zaktualizowano dane','good');
          else
            this.main.setMessage(res.responseMesage,'bad');
        }) 
  }

  validators(name:string){
    if(this.registerForm.controls[name].invalid) return true
    switch(name){
      case 'passwordR':
        if(this.strong(this.registerForm.controls[name].value))
          return true;
        break;
      case 'password':
        if(this.strong(this.registerForm.controls[name].value))
          return true;
        break;
      case 'pesel':
        if(this.pesel(this.registerForm.controls[name].value))
          return true;
        break;
    }
    return false

  }

  strong(paswd:string){
    let number = false;
    let big = false;
    let small = false;
    if(paswd == "" && this.status == 3) return false;
    for(let i=0; i<paswd.length; i++){
      if(paswd[i] >= '0' && paswd[i] <= '9') number = true;
      if(paswd[i] >= 'A' && paswd[i] <= 'Z') big = true;
      if(paswd[i] >= 'a' && paswd[i] <= 'z') small = true;
    }
    if(number == false || big == false || small == false) return true;
    else return false;
  }

  pesel(psl:string){
    if(psl.length == 11)
    {
      let sum=1*Number(psl[0])+3*Number(psl[1])+7*Number(psl[2])+9*Number(psl[3])+1*Number(psl[4])+3*Number(psl[5])+7*Number(psl[6])+9*Number(psl[7])+1*Number(psl[8])+3*Number(psl[9]);
      sum = 10 - (sum%10);
      if(sum!=Number(psl[10]))return true;
      
    }
    
    return false;
  }

  generate(){
    this.service.generateIdCard().subscribe((data:any)=>{
      if(data.responseCode == 1){
        this.registerForm.get('idCard').setValue(data.dateSet);
        this.statusEdit = 1;
        this.ngOnInit();
      }
      else
        this.main.setMessage('Błąd generatora indeksów','bad');
    })
  }

  paswdR(name:string){
    if(!this.registerForm.valid)return true
      if(this.strong(this.registerForm.controls[name].value))return true 
        if(this.pesel(this.registerForm.controls['pesel'].value))return true 
    return false
  }

  outIndeks(){
    if(this.status == 3) return true;
    else return false;
  }
}
