export class Teacher{
    public id:any;
    public photoFile:string = "";
    public email:string = "";
    public firstName:string = "";
    public lastName:string = "";
    public sex:string = "";
    public idCard:string = "";
    public title:string = "";
    public description:string = "";
    public phone:string = "";
    public side:string = "";

    constructor(id:any,photoFile:string, firstName:string,lastName:string,sex:string,email:string,idCard:string,
        title:string, description:string, phone:string, side:string){
            this.id=id;
            this.photoFile=photoFile;
            this.email=email;
            this.firstName=firstName;
            this.lastName=lastName;
            this.sex=sex;
            this.idCard=idCard;
            this.title=title;
            this.description=description;
            this.phone=phone;
            this.side=side;
        }
}