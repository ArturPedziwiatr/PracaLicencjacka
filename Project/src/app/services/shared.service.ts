import { Injectable, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { map} from 'rxjs';
import { User } from '../model/user';
import { ResponseCode } from '../model/responseCode';
import { ResponseModel } from '../model/responseModel';
import { Meet } from '../model/meeting';
import { Teacher } from '../model/teacherDto';
import { Student } from '../model/studentDto';
import { StudentList } from '../model/studentList';

@Injectable({
  providedIn: 'root'
})
export class SharedService implements OnInit {

  readonly APIUrl:string="https://localhost:7012/api";
  readonly PhotoUrl="https://localhost:7012/Photos/";


  constructor(private http:HttpClient) { 
  }

  ngOnInit(): void {
    
  }

  public login(email:string, password:string){
     const body:any={
      login:email,
      password:password
     }
    
    return this.http.post(this.APIUrl + '/Users/Login', body);
  }

  public getUserList(){
    return this.http.get<ResponseModel>(this.APIUrl + 
                            '/Users').pipe(map((res:any)=>{
      let userList = new Array<User>();
      if(res.responseCode == ResponseCode.OK){
        if(res.dateSet){
          res.dateSet.map((x:User)=>{
            userList.push(new User(x.id,x.photoFile,x.firstName,x.lastName,
              x.pesel,x.email,x.position,x.sex,x.idCard));
          })
        }
      }
    return userList;  
    }));
  }

  public addUser(data:any){
    return this.http.post(this.APIUrl + '/Users', data);
  }

  public updateUser(id:number|string,data:any){
    return this.http.put(this.APIUrl + `/Users/${id}`, data);
  }

  public updateBasicUser(id:number|string,data:any){
    return this.http.put(this.APIUrl + `/Users/basic/${id}`, data);
  }

  public deleteUser(id:number|string){
    return this.http.delete(this.APIUrl + `/Users/${id}`);
  } 

  public getMeetingList(){
    return this.http.get<ResponseModel>(this.APIUrl + 
                            '/Meting').pipe(map((res:any)=>{
      let meetingList = new Array<Meet>();
      if(res.responseCode == ResponseCode.OK){
        if(res.dateSet){
          res.dateSet.map((x:any)=>{
            meetingList.push(new Meet(x.id, x.idTeacher, x.idStudent, x.title,
              x.description, x.isAccepted, x.dateStart, x.dateEnd));
          })
        }
      }
    return meetingList;  
    }));
  }

  public studentList(id:any){
    return this.http.get(this.APIUrl + `/Connector/S/${id}`).pipe(map((res:any)=>{
      let meetingList = new Array<StudentList>();
      if(res.responseCode == ResponseCode.OK){
        if(res.dateSet){
          res.dateSet.map((x:any)=>{
            meetingList.push(new StudentList(x.firstName,x.lastName,x.idCard));
          })
        }
      }
    return meetingList;  
    }));
  }

  public addMeet(Title:string,Description:string,DateStart:string,DateEnd:string, IsAccepted:boolean){
    const model:any={
      title: Title,
      description: Description,
      dateStart: DateStart,
      dateEnd:  DateEnd,
      isAccepted:IsAccepted
    }

    return this.http.post(this.APIUrl + '/Meting', model);
  }

  public addConnector(IdTeacher:string , IdStudent:string[], IdMessage:string){
    const model:any={
      idMessage: IdMessage,
      idTeacher: IdTeacher,
      studentIds: IdStudent
    }

    return this.http.post(this.APIUrl + '/Connector', model);
  }

  public updateMeet(id:number|string, Title:string, Description:string, DateStart:string, DateEnd:string){
    const body:any={
      title:Title,
      description:Description,
      dateStart:DateStart,
      dateEnd:DateEnd
    }
    return this.http.put(this.APIUrl + `/Meting/${id}`, body);
  }

  public deleteMeet(id:number|string){
    return this.http.delete(this.APIUrl + `/Meting/${id}`);
  } 

  public changeAccepted(id:any){
    return this.http.put(this.APIUrl + `/Meting/isAccepted/${id}`,"true");
  } 

  public changeEnd(id:number|string){
    return this.http.delete(this.APIUrl + `/Meting/isEnd/${id}`);
  } 

  public getMeetingTeacher(id: number|string){
    return this.http.get(this.APIUrl + 
      `/Meting/T/${id}`).pipe(map((res:any)=>{
    let meetingList = new Array<Meet>();
    if(res.responseCode == ResponseCode.OK){
      if(res.dateSet){
        res.dateSet.map((x:any)=>{
          meetingList.push(new Meet(x.id, x.idTeacher, 0, x.title,
          x.description, x.isAccepted, x.dateStart, x.dateEnd));
          })
        }
      }
      return meetingList;  
    }));
  }

  public getMeetingStudent(id: number|string){
    return this.http.get(this.APIUrl + 
      `/Meting/S/${id}`).pipe(map((res:any)=>{
    let meetingList = new Array<Meet>();
    if(res.responseCode == ResponseCode.OK){
      if(res.dateSet){
        res.dateSet.map((x:any)=>{
          meetingList.push(new Meet(x.id, x.idTeacher, x.idStudent, x.title,
          x.description, x.isAccepted, x.dateStart, x.dateEnd));
          })
        }
      }
      return meetingList;  
    }));
  }

  public getTeacherList(){
    return this.http.get(this.APIUrl + 
                            '/Teachers/GetTeacher').pipe(map((res:any)=>{
      let teacherList = new Array<Teacher>();
      if(res.responseCode == ResponseCode.OK){
        if(res.dateSet){
          res.dateSet.map((x:any)=>{
            teacherList.push(new Teacher(x.id,x.photoFile,x.firstName,x.lastName,
              x.sex,x.email,x.idCard,x.title,x.description,x.phone,x.side));
          })
        }
      }
    return teacherList;  
    }));
  }

  public getStudentList(){
    return this.http.get<ResponseModel>(this.APIUrl + 
                            '/Teachers/GetStudent').pipe(map((res:any)=>{
      let studentList = new Array<Student>();
      if(res.responseCode == ResponseCode.OK){
        if(res.dateSet){
          res.dateSet.map((x:any)=>{
            studentList.push(new Student(x.id,x.photoFile,x.firstName,x.lastName,
              x.sex,x.email,x.idCard));
          })
        }
      }
    return studentList;  
    }));
  }

  public getTeacherSetting(id:number){
    return this.http.get<ResponseModel>(this.APIUrl + `/Teachers/${id}`);
  }

  public updateTeacher(id:number|string,data:any){
    return this.http.put(this.APIUrl + `/Teachers/${id}`, data);
  }

  public changePassword(id:number, data:any){
    return this.http.put<ResponseModel>(this.APIUrl + `/Users/changePassword/${id}`, data);
  }

  public changePhoto(id:number, data:string){
    return this.http.put<ResponseModel>(this.APIUrl + `/Users/changePhoto/${id}/${data}`, data);
  }

  public getUserId(id:number){
    return this.http.get<ResponseModel>(this.APIUrl + `/Users/${id}`);
  }

  public UploadPhoto(val:any){
    return this.http.post(this.APIUrl+'/Users/saveFile',val);
  }
}


