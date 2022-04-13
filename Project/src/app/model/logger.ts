export class Logger{
    public email:string = "";
    public firstName:string = "";
    public lastName:string = "";
    public position:string = "";
    public sex:string = "";

    constructor(firstName:string,lastName:string,email:string,
        position:string,sex:string){
            this.email=email;
            this.firstName=firstName;
            this.lastName=lastName;
            this.position=position;
            this.sex=sex;
        }
}