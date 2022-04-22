import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-anty-plagiat',
  templateUrl: './anty-plagiat.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./anty-plagiat.component.css']
})
export class AntyPlagiatComponent implements OnInit {
  files: File[] = [];
  text: Array<string> = [];
  active:boolean;

  closeResult: string='';
  
  constructor(config: NgbModalConfig, private modal: NgbModal, private service:SharedService) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.modal.dismissAll();
    this.active = false;
  }

  onSelect(event:any) {
    this.files.push(...event.addedFiles);
    if(this.files.length > 2) this.files.splice(2,(this.files.length -2));
	}

	onRemove(event:any) {
		this.files.splice(this.files.indexOf(event), 1);
	}

  ifActive():boolean{
    if(this.files.length == 2) return true;
    else return false;
  }

  antyPlagiatSystem(){
    this.active = true;
    for(let f of this.files){
      this.addText(f);
    }
  }

  addText(file:File){
    var myReader: FileReader = new FileReader();
    myReader.onloadend = (e) => {
      this.text.push(myReader.result as string);
    };
    myReader.readAsText(file);
  }

  buttonPlagiat(content: any){
    this.modal.open(content, { centered: true, size: 'xl' });
  }
}
