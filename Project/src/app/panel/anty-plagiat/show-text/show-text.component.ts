import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-show-text',
  templateUrl: './show-text.component.html',
  styleUrls: ['./show-text.component.css']
})
export class ShowTextComponent implements OnInit {

  @Input() text:any;

  textO:string[] = ["asd","asddas","asdsad"];
  textOne:string[] = [];
  textSecond:string[] = [];
  matrix: Array<string> = [];

  constructor() { }

  ngOnInit(): void {
    this.addWorld();
    this.getSameWorld();
  }

  addWorld(){
    this.textOne = this.text[0].split(' ');
    this.textSecond = this.text[1].split(' ');
  }

  getSameWorld(){
    for(let i=0; i<this.textOne.length; i++){
      for(let j=0; j<this.textSecond.length; j++){
        if(this.textOne[i].toLowerCase() === this.textSecond[j].toLowerCase() && !(this.matrix.includes(this.textOne[i]))){
            this.matrix.push(this.textOne[i]);
        }
      }
    }
  }

  findWord(word: string): boolean{
    if(this.matrix.includes(word)) return true;
    else return false;
  }

}
