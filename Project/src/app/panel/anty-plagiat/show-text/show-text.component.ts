import { Component, Input, OnInit } from '@angular/core';
import { AntyPlagiatComponent } from '../anty-plagiat.component';

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

  constructor(private show:AntyPlagiatComponent) { }

  ngOnInit(): void {
    this.addWorld();
    this.getSameWorld();
  }

  addWorld(){
    const splited = /[., „\r\n\”""]/;
    this.textOne = this.text[0].split(splited);
    this.textOne = this.textOne.filter(e => e!="");
    this.textSecond = this.text[1].split(splited);
    this.textSecond = this.textSecond.filter(e => e!="");
  }

  getSameWorld(){
    for(let i=0; i<this.textOne.length; i++){
      for(let j=0; j<this.textSecond.length; j++){
        if(this.textOne[i].toLowerCase() === this.textSecond[j].toLowerCase() && !(this.matrix.includes(this.textOne[i]))){
          if(this.textOne[i]!='')
            this.matrix.push(this.textOne[i]);
        }
      }
    }
  }

  findWord(word: string): boolean{
    if(this.matrix.includes(word)) return true;
    else return false;
  }

  getPercent(text:string[], mtx:string[]){
    
    return ((mtx.length/text.length)*100).toFixed(2);
  }

}
