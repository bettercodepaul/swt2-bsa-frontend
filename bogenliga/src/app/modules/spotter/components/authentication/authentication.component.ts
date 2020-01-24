import {Component, OnInit} from '@angular/core';
import {ButtonSize} from '../../../shared/components/buttons';

@Component({
  selector: 'bla-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})

export class AuthenticationComponent implements OnInit {

  public ButtonSize = ButtonSize;

  constructor() { }

  ngOnInit() {
  }

}
