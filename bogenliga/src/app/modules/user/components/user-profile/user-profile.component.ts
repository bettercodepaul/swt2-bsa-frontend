import {Component, OnInit} from '@angular/core';
import {USER_PROFILE_CONFIG} from './user-profile.config';
import {Response} from '../../../shared/data-provider';
import {ButtonType, CommonComponent} from '../../../shared/components';
import {UserProfileDataProviderService} from '../../services/user-profile-data-provider.service';
import {ActivatedRoute, Router} from '@angular/router';
import {UserProfileDO} from '../../types/user-profile-do.class';
import {NotificationService} from '../../../shared/services/notification';

@Component({
  selector: 'bla-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  providers: []
})
export class UserProfileComponent extends CommonComponent implements OnInit {

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
        .then((response: Response<UserProfileDO>) => this.handleSuccess(response))
        .catch((response: Response<UserProfileDO>) => this.handleFailure(response));
  }

  private handleSuccess(response: Response<UserProfileDO>) {
    this.currentUserProfile = response.payload;
    this.loading = false;
  }

  private handleFailure(response: Response<UserProfileDO>) {
    this.loading = false;

  }
}
