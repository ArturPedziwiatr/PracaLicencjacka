import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/services/shared.service';
import { User } from 'src/app/model/user';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  closeResult: string='';
  constructor(config: NgbModalConfig, private modal: NgbModal, private service: SharedService, private main:AppComponent) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  usersList:User[]=[];
  modalTitle: string = '';
  searchText:string = '';
  status = 0;  //1-addUser 2-addTeacher 3-editUser 4-editTeacher
  usr:any;

  ngOnInit(): void {
    this.modal.dismissAll();
    this.service.getUserList().subscribe((data:any)=>{
      this.usersList = data;
    });
  }

  addUser(content: any){
    this.usr={
      photoFile:"undefinded.png",
      firstName:'',
      lastName:'',
      email:'',
      pesel:'',
      position:'S',
      sex:'U',
      login:'',
      idCard:''
    }
    this.modal.open(content, { centered: true, size: 'xl' });
    this.modalTitle = "Dodaj studenta";
    this.status = 1;
  }

  addTeacher(content: any){
    this.usr={
      photoFile:"undefinded.png",
      firstName:'',
      lastName:'',
      email:'',
      pesel:'',
      position:'T',
      sex:'U',
      login:'',
      idCard:''
    }
    this.modal.open(content, { centered: true, size: 'xl' });
    this.modalTitle = "Dodaj Pracownika";
    this.status = 2;
  }

  editClick(content:any,item:any){
    
      this.status = 3;
      this.modalTitle="Edytuj użytkownika";
      this.usr = {
        id:item.id,
        photoFile:item.photoFile,
        firstName:item.firstName,
        lastName:item.lastName,
        email:item.email,
        pesel:item.pesel,
        sex:item.sex,
        idCard:item.idCard,
      }
    

    this.modal.open(content, { centered: true, size: 'xl'  });
  }

  deleteClick(item:any){
    if(confirm('Jesteś pewny ??')){
       if(item.position == 'A') alert("Nie masz uprawnień")
      else{
        this.service.deleteUser(item.id).subscribe((res:any) =>{
          if(res.responseCode == 1){
            this.ngOnInit()
            this.main.setMessage('Pomyślnie usunięto użytkownika','good');
          }
          else
            this.main.setMessage('Nie udało się usunąć użytkownika','bad');
          
        });
       }
    }  
  }

  setAdmin(id:any, status:number){
    this.service.setAdmin(id).subscribe((data:any)=>{
      if(data.responseCode == 1){
        this.ngOnInit()
        if(status == 1) this.main.setMessage('Pomyślnie dodano uprawnienia','good');
        if(status == 2) this.main.setMessage('Pomyślnie zabrano uprawnienia','good');
      }
      else
        this.main.setMessage('Nie odnaleziono użytkownika','bad');
    })
  }

  getPosition(){
    const user = JSON.parse(localStorage.getItem("userInfo"));
    return user.position;
  }

  ifAdmin(){
    const user = JSON.parse(localStorage.getItem("userInfo"));
    return user.isAdmin;
  }
}
