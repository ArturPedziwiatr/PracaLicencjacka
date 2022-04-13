import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map} from 'rxjs';
import { User } from '../model/user';
import { ResponseCode } from '../model/responseCode';
import { ResponseModel } from '../model/responseModel';
import { Logger } from '../model/logger';
import { Constants } from '../auth/constants';

@Injectable({
  providedIn: 'root'
})
export class SharedService implements OnInit {

  readonly APIUrl:string="https://localhost:44319/api";
  readonly PhotoUrl="http://localhost:52431/Photos";


  constructor(private http:HttpClient) { 
  }

  ngOnInit(): void {
    
  }

  public login(email:string, password:string){
     const body:any={
      Email:email,
      Password:password
     }
    
    return this.http.post(this.APIUrl + '/User/Login', body);
  }

  /*public getLogger(){
    
    let userInf = JSON.parse(localStorage.getItem("userInfo"));
    let logger;
    console.log(userInf);
    if(userInf != null)
      logger = new Logger(userInf.firstName,userInf.lastName, userInf.email, userInf.position, userInf.sex);
    else
      logger = null;

      return logger;
  }*/

  public getUserList(){
    let userInf = JSON.parse(localStorage.getItem(Constants.USER_KEY));
    const head = new HttpHeaders({
      'Authorization':`Bearer ${userInf?.token}`
    });
    return this.http.get<ResponseModel>(this.APIUrl + 
                            '/User/GetAllUsers',
                            {headers:head}).pipe(map((res:any)=>{
      let userList = new Array<User>();
      if(res.responseCode == ResponseCode.OK){
        if(res.dateSet){
          res.dateSet.map((x:User)=>{
            userList.push(new User(x.email,x.firstName,x.lastName,
              x.pesel,x.position,x.sex,x.idCard));
          })
        }
      }
    return userList;  
    }));
  }

  public addUser(data:any){
    return this.http.post(this.APIUrl + '/User/Register', data);
  }

  updateUser(id:number|string,data:any){
    return this.http.put(this.APIUrl + `/User/${id}`, data);
  }

  deleteUser(id:number|string){
    return this.http.delete(this.APIUrl + `/User/${id}`);
  } 
}

