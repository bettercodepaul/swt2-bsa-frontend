import {Component, OnInit} from '@angular/core';
import {USER_PROFILE_CONFIG} from './user-profile.config';

@Component({
  selector:    'bla-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls:   ['./user-profile.component.scss'],
  providers:   []
})
export class UserProfileComponent implements OnInit {

  public config = USER_PROFILE_CONFIG;

  constructor() {
  }

  ngOnInit() {
  }

}
