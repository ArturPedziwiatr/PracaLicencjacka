export class User{
    public id:any;
    public photoFile:string = "";
    public email:string = "";
    public firstName:string = "";
    public lastName:string = "";
    public pesel:string = "";
    public position:string = "";
    public sex:string = "";
    public idCard:string = "";
    public isAdmin:boolean;

    constructor(id:any, photoFile:string, firstName:string,lastName:string,pesel:string,email:string,
        position:string,sex:string,idCard:string,isAdmin:boolean){
            this.id=id;
            this.photoFile=photoFile;
            this.email=email;
            this.firstName=firstName;
            this.lastName=lastName;
            this.pesel=pesel;
            this.position=position;
            this.sex=sex;
            this.idCard=idCard;
            this.isAdmin=isAdmin;
        }
}