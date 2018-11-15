import {Component, OnInit} from '@angular/core';
import {DSB_MITGLIED_DETAIL_CONFIG} from './mannschaft-detail.config';
import {Response} from '../../../../shared/data-provider';
import {ButtonType, CommonComponent} from '../../../../shared/components';
import {DsbMitgliedDataProviderService} from '../../../services/mannschaft-data-provider.service';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined, isUndefined} from 'util';
import {DsbMitgliedDO} from '../../../types/mannschaft-do.class';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';

const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_MANNSCHAFT = 'mannschaft_detail_delete';
const NOTIFICATION_DELETE_MANNSCHAFT_SUCCESS = 'mannschaft_detail_delete_success';
const NOTIFICATION_DELETE_MANNSCHAFT_FAILURE = 'mannschaft_detail_delete_failure';
const NOTIFICATION_SAVE_MANNSCHAFT = 'mannschaft_detail_save';
const NOTIFICATION_UPDATE_MANNSCHAFT = 'mannschaft_detail_update';


@Component({
  selector:    'bla-mannschaft-detail',
  templateUrl: './mannschaft-detail.component.html',
  styleUrls:   ['./mannschaft-detail.component.scss']
})
export class MannschaftDetailComponent extends CommonComponent implements OnInit {

  public config = DSB_MANNSCHAFT_CONFIG;
  public ButtonType = ButtonType;
  public currentMitglied: MannschaftDO = new MannschaftDO();

  public deleteLoading = false;
  public saveLoading = false;

  constructor(private MannschaftDataProvider: MannschaftDataProviderService,
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
          this.currentMannschaft = new MannschaftDO();
          this.loading = false;
          this.deleteLoading = false;
          this.saveLoading = false;
        } else {
          this.loadById(params[ID_PATH_PARAM]);
        }
      }
    });
  }

  public onSave(ignore: any): void {
    this.saveLoading = true;

    // persist
    this.MannschaftDataProvider.create(this.currentMannschaft)
        .then((response: Response<MannschaftDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            const notification: Notification = {
              id:          NOTIFICATION_SAVE_DSB_MITGLIED,
              title:       'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_SAVE_MANNSCHAFT)
                .subscribe(myNotification => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/mannschaft/' + response.payload.id);
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: Response<DsbMitgliedDO>) => {
          console.log('Failed');
          this.saveLoading = false;


        });
    // show response message
  }

  public onUpdate(ignore: any): void {
    this.saveLoading = true;

    // persist
    this.MannschaftDataProvider.update(this.currentMannschaft)
        .then((response: Response<MannschaftDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {

            const id = this.currentMannschaft.id;

            const notification: Notification = {
              id:          NOTIFICATION_UPDATE_MANNSCHAFT + id,
              title:       'MANAGEMENT.DSBMITGLIEDER_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.DSBMITGLIEDER_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_UPDATE_MANNSCHAFT + id)
                .subscribe(myNotification => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/mannschaft');
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: Response<MannschaftDO>) => {
          console.log('Failed');
          this.saveLoading = false;
        });
    // show response message
  }

  public onDelete(ignore: any): void {
    this.deleteLoading = true;
    this.notificationService.discardNotification();

    const id = this.currentMannschaft.id;

    const notification: Notification = {
      id:               NOTIFICATION_DELETE_MANNSCHAFT + id,
      title:            'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_MANNSCHAFT + id)
        .subscribe(myNotification => {

          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.MannschaftDataProvider.deleteById(id)
                .then(response => this.handleDeleteSuccess(response))
                .catch(response => this.handleDeleteFailure(response));
          }
        });

    this.notificationService.showNotification(notification);
  }

  public entityExists(): boolean {
    return this.currentMannschaft.id > 0;
  }

  private loadById(id: number) {
    this.MannschaftDataProvider.findById(id)
        .then((response: Response<DsbMitgliedDO>) => this.handleSuccess(response))
        .catch((response: Response<DsbMitgliedDO>) => this.handleFailure(response));
  }

  private handleSuccess(response: Response<MannschaftDO>) {
    this.currentMannschaft = response.payload;
    this.loading = false;
  }

  private handleFailure(response: Response<MannschaftDO>) {
    this.loading = false;

  }

  private handleDeleteSuccess(response: Response<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_MANNSCHAFT_SUCCESS,
      title:       'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.DELETE_SUCCESS.TITLE',
      description: 'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.DELETE_SUCCESS.DESCRIPTION',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_MANNSCHAFT_SUCCESS)
        .subscribe(myNotification => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.router.navigateByUrl('/verwaltung/mannschaft');
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleDeleteFailure(response: Response<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_MANNSCHAFT_FAILURE,
      title:       'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.DELETE_FAILURE.TITLE',
      description: 'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.DELETE_FAILURE.DESCRIPTION',
      severity:    NotificationSeverity.ERROR,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_MANNSCHAFT_FAILURE)
        .subscribe(myNotification => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }
}
