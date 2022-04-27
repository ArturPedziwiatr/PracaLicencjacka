export class Student{
    public id:any;
    public photoFile:string = "";
    public email:string = "";
    public firstName:string = "";
    public lastName:string = "";
    public sex:string = "";
    public idCard:string = "";

    constructor(id:any,photoFile:string, firstName:string,lastName:string,sex:string,email:string,idCard:string){
            this.id=id;
            this.photoFile=photoFile;
            this.email=email;
            this.firstName=firstName;
            this.lastName=lastName;
            this.sex=sex;
            this.idCard=idCard;
        }
}