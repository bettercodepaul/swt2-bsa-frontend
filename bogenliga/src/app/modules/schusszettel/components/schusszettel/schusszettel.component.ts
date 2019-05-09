import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'bla-schusszettel',
  templateUrl: './schusszettel.component.html',
  styleUrls: ['./schusszettel.component.scss']
})
export class SchusszettelComponent implements OnInit {

  InputsArray: string[] = [];

  constructor() {
    console.log('Schusszettel Component');
  }

  ngOnInit() {
    // initialwert schützen inputs
    this.InputsArray[14] = '1';
    this.InputsArray[25] = '2';
    this.InputsArray[36] = '3';
  }



  onChange(value, i) {
    console.log('onChange');
    console.log(value);
    if (value === '+') {
      this.InputsArray[i] = '10';

    } else {
      this.InputsArray[i] = value;
    }
  }
}
