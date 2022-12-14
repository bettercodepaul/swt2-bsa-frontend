import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ButtonType, CommonComponentDirective} from '../../../shared/components';
import {BogenligaResponse} from '../../../shared/data-provider';
import {NotificationService} from '../../../shared/services/notification';
import {UserProfileDataProviderService} from '../../services/user-profile-data-provider.service';
import {UserProfileDO} from '../../types/user-profile-do.class';
import {USER_PROFILE_CONFIG} from './user-profile.config';
import {SessionHandling} from '@shared/event-handling';
import {CurrentUserService, OnOfflineService} from '@shared/services';

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
  private sessionHandling: SessionHandling;

  constructor(private userProfileDataProvider: UserProfileDataProviderService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private currentUserService: CurrentUserService,
    private onOfflineService: OnOfflineService) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);
  }

  ngOnInit() {
    this.loading = true;

    this.notificationService.discardNotification();
    this.loadCurrentUserProfile();
  }

  /** When a MouseOver-Event is triggered, it will call this inMouseOver-function.
   *  This function calls the checkSessionExpired-function in the sessionHandling class and get a boolean value back.
   *  If the boolean value is true, then the page will be reloaded and due to the expired session, the user will
   *  be logged out automatically.
   */
  public onMouseOver(event: any) {
    const isExpired = this.sessionHandling.checkSessionExpired();
    if (isExpired) {
      window.location.reload();
    }
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
