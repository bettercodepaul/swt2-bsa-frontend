import {Component, OnInit} from '@angular/core';
import {BENUTZER_DETAIL_CONFIG} from './benutzer-detail.config';
import {BenutzerDataProviderService} from '../../../services/benutzer-data-provider.service';
import {ButtonType, CommonComponent} from '../../../../shared/components';
import {Response} from '../../../../shared/data-provider';
import {BenutzerDO} from '../../../types/benutzer-do.class';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined, isUndefined} from 'util';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';

const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_BENUTZER = 'benutzer_detail_delete';
const NOTIFICATION_DELETE_BENUTZER_SUCCESS = 'benutzer_detail_delete_success';
const NOTIFICATION_DELETE_BENUTZER_FAILURE = 'benutzer_detail_delete_failure';
const NOTIFICATION_SAVE_BENUTZER = 'benutzer_detail_save';
const NOTIFICATION_UPDATE_BENUTZER = 'benutzer_detail_update';


@Component({
  selector:    'bla-benutzer-detail',
  templateUrl: './benutzer-detail.component.html',
  styleUrls:   ['./benutzer-detail.component.scss']
})
export class BenutzerDetailComponent extends CommonComponent implements OnInit {

  public config = BENUTZER_DETAIL_CONFIG;
  public ButtonType = ButtonType;
  public currentBenutzer: BenutzerDO = new BenutzerDO();

  public deleteLoading = false;
  public saveLoading = false;
  public editEmail = true;

  constructor(private benutzerDataProvider: BenutzerDataProviderService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.loading = true;

    this.notificationService.discardNotification();

    this.route.params.subscribe(params => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        const id = params[ID_PATH_PARAM];
        if (id === 'add') {
          this.currentBenutzer = new BenutzerDO();
          this.loading = false;
          this.deleteLoading = false;
          this.saveLoading = false;
          this.editEmail = false;
        } else {
          this.loadById(params[ID_PATH_PARAM]);
        }
      }
    });
  }

  public onSave(ignore: any): void {
    this.saveLoading = true;

    // persist
    this.benutzerDataProvider.create(this.currentBenutzer)
      .then((response: Response<BenutzerDO>) => {
        if (!isNullOrUndefined(response)
          && !isNullOrUndefined(response.payload)
          && !isNullOrUndefined(response.payload.id)) {
          console.log('Saved with id: ' + response.payload.id);

          const notification: Notification = {
            id: NOTIFICATION_SAVE_BENUTZER,
            title: 'MANAGEMENT.BENUTZER_DETAIL.NOTIFICATION.SAVE.TITLE',
            description: 'MANAGEMENT.BENUTZER_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
            severity: NotificationSeverity.INFO,
            origin: NotificationOrigin.USER,
            type: NotificationType.OK,
            userAction: NotificationUserAction.PENDING
          };

          this.notificationService.observeNotification(NOTIFICATION_SAVE_BENUTZER)
            .subscribe(myNotification => {
              if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                this.saveLoading = false;
                this.router.navigateByUrl('/verwaltung/benutzer/' + response.payload.id);
              }
            });

          this.notificationService.showNotification(notification);
        }
      }, (response: Response<BenutzerDO>) => {
        console.log('Failed');
        this.saveLoading = false;


      });
    // show response message
  }

  public onUpdate(ignore: any): void {
    this.saveLoading = true;

    // persist
    this.benutzerDataProvider.update(this.currentBenutzer)
      .then((response: Response<BenutzerDO>) => {
        if (!isNullOrUndefined(response)
          && !isNullOrUndefined(response.payload)
          && !isNullOrUndefined(response.payload.id)) {

          const id = this.currentBenutzer.id;

          const notification: Notification = {
            id: NOTIFICATION_UPDATE_BENUTZER + id,
            title: 'MANAGEMENT.BENUTZER_DETAIL.NOTIFICATION.SAVE.TITLE',
            description: 'MANAGEMENT.BENUTZER_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
            severity: NotificationSeverity.INFO,
            origin: NotificationOrigin.USER,
            type: NotificationType.OK,
            userAction: NotificationUserAction.PENDING
          };

          this.notificationService.observeNotification(NOTIFICATION_UPDATE_BENUTZER + id)
            .subscribe(myNotification => {
              if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                this.saveLoading = false;
                this.router.navigateByUrl('/verwaltung/benutzer');
              }
            });

          this.notificationService.showNotification(notification);
        }
      }, (response: Response<BenutzerDO>) => {
        console.log('Failed');
        this.saveLoading = false;
      });
    // show response message
  }

  public onDelete(ignore: any): void {
    this.deleteLoading = true;
    this.notificationService.discardNotification();

    const id = this.currentBenutzer.id;

    const notification: Notification = {
      id: NOTIFICATION_DELETE_BENUTZER + id,
      title: 'MANAGEMENT.BENUTZER_DETAIL.NOTIFICATION.DELETE.TITLE',
      description: 'MANAGEMENT.BENUTZER_DETAIL.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity: NotificationSeverity.QUESTION,
      origin: NotificationOrigin.USER,
      type: NotificationType.YES_NO,
      userAction: NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_BENUTZER + id)
      .subscribe(myNotification => {

        if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
          this.benutzerDataProvider.deleteById(id)
            .then(response => this.handleDeleteSuccess(response))
            .catch(response => this.handleDeleteFailure(response));
        }
      });

    this.notificationService.showNotification(notification);
  }

  public entityExists(): boolean {
    return this.currentBenutzer.id > 0;
  }

  private loadById(id: number) {
    this.benutzerDataProvider.findById(id)
      .then((response: Response<BenutzerDO>) => this.handleSuccess(response))
      .catch((response: Response<BenutzerDO>) => this.handleFailure(response));
  }

  private handleSuccess(response: Response<BenutzerDO>) {
    this.currentBenutzer = response.payload;
    this.loading = false;
  }

  private handleFailure(response: Response<BenutzerDO>) {
    this.loading = false;

  }

  private handleDeleteSuccess(response: Response<void>): void {

    const notification: Notification = {
      id: NOTIFICATION_DELETE_BENUTZER_SUCCESS,
      title: 'MANAGEMENT.BENUTZER_DETAIL.NOTIFICATION.DELETE_SUCCESS.TITLE',
      description: 'MANAGEMENT.BENUTZER_DETAIL.NOTIFICATION.DELETE_SUCCESS.DESCRIPTION',
      severity: NotificationSeverity.INFO,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_BENUTZER_SUCCESS)
      .subscribe(myNotification => {
        if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
          this.router.navigateByUrl('/verwaltung/benutzer');
          this.deleteLoading = false;
        }
      });

    this.notificationService.showNotification(notification);
  }

  private handleDeleteFailure(response: Response<void>): void {

    const notification: Notification = {
      id: NOTIFICATION_DELETE_BENUTZER_FAILURE,
      title: 'MANAGEMENT.BENUTZER_DETAIL.NOTIFICATION.DELETE_FAILURE.TITLE',
      description: 'MANAGEMENT.BENUTZER_DETAIL.NOTIFICATION.DELETE_FAILURE.DESCRIPTION',
      severity: NotificationSeverity.ERROR,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_BENUTZER_FAILURE)
      .subscribe(myNotification => {
        if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
          this.deleteLoading = false;
        }
      });

    this.notificationService.showNotification(notification);
  }

}
