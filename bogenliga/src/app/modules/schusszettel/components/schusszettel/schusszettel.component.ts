import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'bla-schusszettel',
  templateUrl: './schusszettel.component.html',
  styleUrls: ['./schusszettel.component.scss']
})
export class SchusszettelComponent implements OnInit {

  pfeile: string[] = [];

  constructor() {
    console.log("Schusszettel Component")
  }

  ngOnInit() {
  }



  onChange(value, i) {
    console.log("onChange");
    console.log(value);
    if (value == "+") {
      this.pfeile[i] = "10";

    } else {
      this.pfeile[i] = value;
    }
  }
}
