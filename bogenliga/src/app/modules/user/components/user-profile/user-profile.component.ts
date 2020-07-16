import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ButtonType, CommonComponentDirective} from '../../../shared/components';
import {BogenligaResponse} from '../../../shared/data-provider';
import {NotificationService} from '../../../shared/services/notification';
import {UserProfileDataProviderService} from '../../services/user-profile-data-provider.service';
import {UserProfileDO} from '../../types/user-profile-do.class';
import {USER_PROFILE_CONFIG} from './user-profile.config';

@Component({
  selector:    'bla-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls:   ['./user-profile.component.scss'],
  providers:   []
})
export class UserProfileComponent extends CommonComponentDirective implements OnInit {

  public config = USER_PROFILE_CONFIG;
  public ButtonType = ButtonType;
  public currentUserProfile: UserProfileDO = new UserProfileDO();

  constructor(private userProfileDataProvider: UserProfileDataProviderService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.loading = true;

    this.notificationService.discardNotification();
    this.loadCurrentUserProfile();
  }

  private loadCurrentUserProfile() {
    this.userProfileDataProvider.findCurrentUserProfile()
      .then((response: BogenligaResponse<UserProfileDO>) => this.handleSuccess(response))
      .catch((response: BogenligaResponse<UserProfileDO>) => this.handleFailure(response));
  }

  private handleSuccess(response: BogenligaResponse<UserProfileDO>) {
    this.currentUserProfile = response.payload;
    this.loading = false;
  }

  private handleFailure(response: BogenligaResponse<UserProfileDO>) {
    this.loading = false;

  }
}
