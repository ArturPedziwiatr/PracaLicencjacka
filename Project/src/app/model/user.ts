export class User{
    public email:string = "";
    public firstName:string = "";
    public lastName:string = "";
    public pesel:string = "";
    public position:string = "";
    public sex:string = "";
    public idCard:string = "";

    constructor(firstName:string,lastName:string,pesel:string,email:string,
        position:string,sex:string,idCard:string){
            this.email=email;
            this.firstName=firstName;
            this.lastName=lastName;
            this.pesel=pesel;
            this.position=position;
            this.sex=sex;
            this.idCard=idCard;
        }
}