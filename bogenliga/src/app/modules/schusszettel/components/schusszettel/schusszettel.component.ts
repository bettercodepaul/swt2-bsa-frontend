import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'bla-schusszettel',
  templateUrl: './schusszettel.component.html',
  styleUrls: ['./schusszettel.component.scss']
})
export class SchusszettelComponent implements OnInit {

  constructor() {
    console.log("Schusszettel Component")
  }

  ngOnInit() {
  }

}
