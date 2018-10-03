import {Component, OnInit} from '@angular/core';
import {Credentials} from '../../types/credentials.class';

@Component({
  selector: 'bla-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss',
    './../../../../app.component.scss']
})
export class LoginComponent implements OnInit {

  public credentials = new Credentials();

  constructor() { }

  ngOnInit() {
  }

}
