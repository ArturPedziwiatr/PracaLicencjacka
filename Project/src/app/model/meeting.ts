export class Meet{
    public id:any;
    public idTeacher:any;
    public idStudent:any;
    public title:string = "";
    public description:string = "";
    public year:number;
    public month:number;
    public day:number;
    public hourStart:number;
    public minutesStart:number;
    public hourEnd:number;
    public minutesEnd:number;
    public isAccepted:boolean;

    constructor(id:any, idTeacher:any, idStudent:any, title:string,
        description:string, isAccepted:boolean, timeStart:string, timeEnd:string){
            this.id=id;
            this.idTeacher=idTeacher;
            this.idStudent=idStudent;
            this.title=title;
            this.description=description;
            this.isAccepted=isAccepted;
            this.year=parseInt(timeStart.substr(0,4));
            this.month=parseInt(timeStart.substr(5,2));
            this.day=parseInt(timeStart.substr(8,2));
            this.hourStart=parseInt(timeStart.substr(11,2));
            this.minutesStart=parseInt(timeStart.substr(14,2));
            this.hourEnd=parseInt(timeEnd.substr(11,2));
            this.minutesEnd=parseInt(timeEnd.substr(14,2));
        }
}