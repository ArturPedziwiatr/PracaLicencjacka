import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/services/shared.service';
import { User } from 'src/app/model/user';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  closeResult: string='';
  constructor(config: NgbModalConfig, private modal: NgbModal, private service: SharedService, ) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  usersList:User[]=[];
  modalTitle: string = '';
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
        this.service.deleteUser(item.id).subscribe(res =>{
          this.ngOnInit();
          var showAddSucces = document.getElementById('delete-success-alert-user');
          if(showAddSucces){
            showAddSucces.style.display = "block";
          }
          setTimeout(function(){
            if(showAddSucces){
              showAddSucces.style.display = "none";
            }
          }, 3000);
        });
       }
    }  
  }
}
