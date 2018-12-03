import {Component, OnInit} from '@angular/core';
import {USER_PROFILE_CONFIG} from './user-profile.config';
import {Response} from '../../../shared/data-provider';
import {ButtonType, CommonComponent} from '../../../shared/components';
import {UserProfileDataProviderService} from '../../services/user-profile-data-provider.service';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined, isUndefined} from 'util';
import {UserProfileDO} from '../../types/user-profile-do.class';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../shared/services/notification';

const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_USER_PROFILE = 'user_profile_delete';
const NOTIFICATION_DELETE_USER_PROFILE_SUCCESS = 'user_profile_delete_success';
const NOTIFICATION_DELETE_USER_PROFILE_FAILURE = 'user_profile_delete_failure';
const NOTIFICATION_SAVE_USER_PROFILE = 'user_profile_save';
const NOTIFICATION_UPDATE_USER_PROFILE = 'user_profile_update';

@Component({
  selector:    'bla-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls:   ['./user-profile.component.scss'],
  providers:   []
})
export class UserProfileComponent extends CommonComponent implements OnInit {

  public config = USER_PROFILE_CONFIG;
  public ButtonType = ButtonType;
  public currentUserProfile: UserProfileDO = new UserProfileDO();

  public deleteLoading = false;
  public saveLoading = false;

  constructor(private userProfileDataProvider: UserProfileDataProviderService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.loading = true;

    this.notificationService.discardNotification();
    console.log('TeeeeeeeeestOnInit');
    this.loadById(5);
    this.route.params.subscribe(params => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        const id = params[ID_PATH_PARAM];
        if (id === 'add') {
          console.log('Params');
          console.log(params[ID_PATH_PARAM]);
          this.currentUserProfile = new UserProfileDO();
          this.loading = false;
          this.deleteLoading = false;
          this.saveLoading = false;
        } else {

          console.log('Teeeeeeeeest');
          this.loadById(params[ID_PATH_PARAM]);
        }
      }
    });
  }

  public onSave(ignore: any): void {
    this.saveLoading = true;

    // persist
    this.userProfileDataProvider.create(this.currentUserProfile)
      .then((response: Response<UserProfileDO>) => {
        if (!isNullOrUndefined(response)
          && !isNullOrUndefined(response.payload)
          && !isNullOrUndefined(response.payload.id)) {
          console.log('Saved with id: ' + response.payload.id);

          const notification: Notification = {
            id: NOTIFICATION_SAVE_USER_PROFILE,
            title: 'MANAGEMENT.USERPROFILE.NOTIFICATION.SAVE.TITLE',
            description: 'MANAGEMENT.USERPROFILE.NOTIFICATION.SAVE.DESCRIPTION',
            severity: NotificationSeverity.INFO,
            origin: NotificationOrigin.USER,
            type: NotificationType.OK,
            userAction: NotificationUserAction.PENDING
          };

          this.notificationService.observeNotification(NOTIFICATION_SAVE_USER_PROFILE)
            .subscribe(myNotification => {
              if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                this.saveLoading = false;
                this.router.navigateByUrl('/user/' + response.payload.id);
              }
            });

          this.notificationService.showNotification(notification);
        }
      }, (response: Response<UserProfileDO>) => {
        console.log('Failed');
        this.saveLoading = false;


      });
    // show response message
  }

  public onUpdate(ignore: any): void {
    this.saveLoading = true;

    // persist
    this.userProfileDataProvider.update(this.currentUserProfile)
      .then((response: Response<UserProfileDO>) => {
        if (!isNullOrUndefined(response)
          && !isNullOrUndefined(response.payload)
          && !isNullOrUndefined(response.payload.id)) {

          const id = this.currentUserProfile.id;

          const notification: Notification = {
            id: NOTIFICATION_UPDATE_USER_PROFILE + id,
            title: 'MANAGEMENT.USERPROFILE.NOTIFICATION.SAVE.TITLE',
            description: 'MANAGEMENT.USERPROFILE.NOTIFICATION.SAVE.DESCRIPTION',
            severity: NotificationSeverity.INFO,
            origin: NotificationOrigin.USER,
            type: NotificationType.OK,
            userAction: NotificationUserAction.PENDING
          };

          this.notificationService.observeNotification(NOTIFICATION_UPDATE_USER_PROFILE + id)
            .subscribe(myNotification => {
              if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                this.saveLoading = false;
                this.router.navigateByUrl('/user');
              }
            });

          this.notificationService.showNotification(notification);
        }
      }, (response: Response<UserProfileDO>) => {
        console.log('Failed');
        this.saveLoading = false;
      });
    // show response message
  }

  //TODO delete funktionalittäten löschen?
  public onDelete(ignore: any): void {
    this.deleteLoading = true;
    this.notificationService.discardNotification();

    const id = this.currentUserProfile.id;

    const notification: Notification = {
      id: NOTIFICATION_DELETE_USER_PROFILE + id,
      title: 'MANAGEMENT.USERPROFILE.NOTIFICATION.DELETE.TITLE',
      description: 'MANAGEMENT.USERPROFILE.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity: NotificationSeverity.QUESTION,
      origin: NotificationOrigin.USER,
      type: NotificationType.YES_NO,
      userAction: NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_USER_PROFILE + id)
      .subscribe(myNotification => {

        if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
          this.userProfileDataProvider.deleteById(id)
            .then(response => this.handleDeleteSuccess(response))
            .catch(response => this.handleDeleteFailure(response));
        }
      });

    this.notificationService.showNotification(notification);
  }

  public entityExists(): boolean {
    return this.currentUserProfile.id > 0;
  }

  private loadById(id: number) {
    this.userProfileDataProvider.findById(id)
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

  private handleDeleteSuccess(response: Response<void>): void {

    const notification: Notification = {
      id: NOTIFICATION_DELETE_USER_PROFILE_SUCCESS,
      title: 'MANAGEMENT.USERPROFILE.NOTIFICATION.DELETE_SUCCESS.TITLE',
      description: 'MANAGEMENT.USERPROFILE.NOTIFICATION.DELETE_SUCCESS.DESCRIPTION',
      severity: NotificationSeverity.INFO,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_USER_PROFILE_SUCCESS)
      .subscribe(myNotification => {
        if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
          this.router.navigateByUrl('/user');
          this.deleteLoading = false;
        }
      });

    this.notificationService.showNotification(notification);
  }

  private handleDeleteFailure(response: Response<void>): void {

    const notification: Notification = {
      id: NOTIFICATION_DELETE_USER_PROFILE_FAILURE,
      title: 'MANAGEMENT.USERPROFILE.NOTIFICATION.DELETE_FAILURE.TITLE',
      description: 'MANAGEMENT.USERPROFILE.NOTIFICATION.DELETE_FAILURE.DESCRIPTION',
      severity: NotificationSeverity.ERROR,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_USER_PROFILE_FAILURE)
      .subscribe(myNotification => {
        if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
          this.deleteLoading = false;
        }
      });

    this.notificationService.showNotification(notification);
  }
}
