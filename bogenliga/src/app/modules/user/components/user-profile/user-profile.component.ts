import {Component, OnInit} from '@angular/core';
import {UserDataProviderService} from '../../services/user-data-provider.service';
import {USER_PROFILE_CONFIG} from './user-profile.config';

@Component({
  selector:    'bla-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls:   ['./user-profile.component.scss'],
  providers:   []
})
export class UserProfileComponent implements OnInit {

  public config = USER_PROFILE_CONFIG;
  public dsbMitglieder: any;

  constructor(private userDataProviderService: UserDataProviderService) {
  }

  ngOnInit() {
    this.userDataProviderService.findAll().subscribe(payload => {
      console.log(JSON.stringify(payload));
      this.dsbMitglieder = payload;
    });
  }

}
