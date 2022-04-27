export class TeacherSet{
    public id:any;
    public title:string = "";
    public description:string = "";
    public phone:string = "";
    public side:string = "";

    constructor(id:any,title:string,description:string,phone:string,side:string){
            this.id=id;
            this.title=title;
            this.description=description;
            this.phone=phone;
            this.side=side;
        }
}