import {Component, OnInit} from '@angular/core';
import {DSBMANNSCHAFT_DETAIL_CONFIG} from '../../dsb-mannschaft/dsb-mannschaft-detail/dsb-mannschaft-detail.config';
import {Response} from '../../../../shared/data-provider';
import {ButtonType, CommonComponent} from '../../../../shared/components';
import {DsbMannschaftDataProviderService} from '../../../services/dsb-mannschaft-data-provider.service';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined, isUndefined} from 'util';
import {DsbMannschaftDO} from '../../../types/dsb-mannschaft-do.class';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';
import {MannschaftsMitgliedDO} from '../../../types/mannschaftsmitglied-do.class';

const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_DSBMANNSCHAFT = 'dsbmannschaft_detail_delete';
const NOTIFICATION_DELETE_DSBMANNSCHAFT_SUCCESS = 'dsbmannschaft_detail_delete_success';
const NOTIFICATION_DELETE_DSBMANNSCHAFT_FAILURE = 'dsbmannschaft_detail_delete_failure';
const NOTIFICATION_SAVE_DSBMANNSCHAFT = 'dsbmannschaft_detail_save';
const NOTIFICATION_UPDATE_DSBMANNSCHAFT = 'dsbmannschaft_detail_update';


@Component({
  selector:    'bla-dsb-mannschaft-detail',
  templateUrl: './mannschaftsmitglied-detail.component.html',
  styleUrls:   ['./dsb-mannschaft-detail.component.scss']
})
export class DsbMannschaftDetailComponent extends CommonComponent implements OnInit {

  public config = DSBMANNSCHAFT_DETAIL_CONFIG;
  public ButtonType = ButtonType;
  public currentDsbMannschaft: DsbMannschaftDO = new DsbMannschaftDO();
  public currentMannschaftsMitglied: MannschaftsMitgliedDO = new MannschaftsMitgliedDO();

  public deleteLoading = false;
  public saveLoading = false;

  constructor(private DsbMannschaftDataProvider: DsbMannschaftDataProviderService,
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
          this.currentDsbMannschaft = new DsbMannschaftDO();
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
    this.DsbMannschaftDataProvider.create(this.currentDsbMannschaft, this.currentMannschaftsMitglied)
      .then((response: Response<DsbMannschaftDO>) => {
        if (!isNullOrUndefined(response)
          && !isNullOrUndefined(response.payload)
          && !isNullOrUndefined(response.payload.id)) {
          console.log('Saved with id: ' + response.payload.id);

          const notification: Notification = {
            id:          NOTIFICATION_SAVE_DSBMANNSCHAFT,
            title:       'MANAGEMENT.DSBMANNSCHAFT_DETAIL.NOTIFICATION.SAVE.TITLE',
            description: 'MANAGEMENT.DSBMANNSCHAFT_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
            severity:    NotificationSeverity.INFO,
            origin:      NotificationOrigin.USER,
            type:        NotificationType.OK,
            userAction:  NotificationUserAction.PENDING
          };

          this.notificationService.observeNotification(NOTIFICATION_SAVE_DSBMANNSCHAFT)
            .subscribe(myNotification => {
              if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                this.saveLoading = false;
                this.router.navigateByUrl('/verwaltung/dsb-mannschaft/' + response.payload.id);
              }
            });

          this.notificationService.showNotification(notification);
        }
      }, (response: Response<DsbMannschaftDO>) => {
        console.log('Failed');
        this.saveLoading = false;


      });
    // show response message
  }

  public onUpdate(ignore: any): void {
    this.saveLoading = true;

    // persist
    this.DsbMannschaftDataProvider.update(this.currentDsbMannschaft)
      .then((response: Response<DsbMannschaftDO>) => {
        if (!isNullOrUndefined(response)
          && !isNullOrUndefined(response.payload)
          && !isNullOrUndefined(response.payload.id)) {

          const id = this.currentDsbMannschaft.id;

          const notification: Notification = {
            id:          NOTIFICATION_UPDATE_DSBMANNSCHAFT + id,
            title:       'MANAGEMENT.DSBMANNSCHAFT_DETAIL.NOTIFICATION.SAVE.TITLE',
            description: 'MANAGEMENT.DSBMANNSCHAFT_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
            severity:    NotificationSeverity.INFO,
            origin:      NotificationOrigin.USER,
            type:        NotificationType.OK,
            userAction:  NotificationUserAction.PENDING
          };

          this.notificationService.observeNotification(NOTIFICATION_UPDATE_DSBMANNSCHAFT + id)
            .subscribe(myNotification => {
              if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                this.saveLoading = false;
                this.router.navigateByUrl('/verwaltung/dsb-mannschaft');
              }
            });

          this.notificationService.showNotification(notification);
        }
      }, (response: Response<DsbMannschaftDO>) => {
        console.log('Failed');
        this.saveLoading = false;
      });
    // show response message
  }

  public onDelete(ignore: any): void {
    this.deleteLoading = true;
    this.notificationService.discardNotification();

    const id = this.currentDsbMannschaft.id;

    const notification: Notification = {
      id:               NOTIFICATION_DELETE_DSBMANNSCHAFT + id,
      title:            'MANAGEMENT.DSBMANNSCHAFT_DETAIL.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.DSBMANNSCHAFT_DETAIL.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_DSBMANNSCHAFT + id)
      .subscribe(myNotification => {

        if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
          this.DsbMannschaftDataProvider.deleteById(id)
            .then(response => this.handleDeleteSuccess(response))
            .catch(response => this.handleDeleteFailure(response));
        }
      });

    this.notificationService.showNotification(notification);
  }

  public entityExists(): boolean {
    return this.currentDsbMannschaft.id > 0;
  }

  private loadById(id: number) {
    this.DsbMannschaftDataProvider.findById(id)
      .then((response: Response<DsbMannschaftDO>) => this.handleSuccess(response))
      .catch((response: Response<DsbMannschaftDO>) => this.handleFailure(response));
  }

  private handleSuccess(response: Response<DsbMannschaftDO>) {
    this.currentDsbMannschaft = response.payload;
    this.loading = false;
  }

  private handleFailure(response: Response<DsbMannschaftDO>) {
    this.loading = false;

  }

  private handleDeleteSuccess(response: Response<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_DSBMANNSCHAFT_SUCCESS,
      title:       'MANAGEMENT.DSBMANNSCHAFT_DETAIL.NOTIFICATION.DELETE_SUCCESS.TITLE',
      description: 'MANAGEMENT.DSBMANNSCHAFT_DETAIL.NOTIFICATION.DELETE_SUCCESS.DESCRIPTION',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_DSBMANNSCHAFT_SUCCESS)
      .subscribe(myNotification => {
        if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
          this.router.navigateByUrl('/verwaltung/dsb-mannschaft');
          this.deleteLoading = false;
        }
      });

    this.notificationService.showNotification(notification);
  }

  private handleDeleteFailure(response: Response<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_DSBMANNSCHAFT_FAILURE,
      title:       'MANAGEMENT.DSBMANNSCHAFT_DETAIL.NOTIFICATION.DELETE_FAILURE.TITLE',
      description: 'MANAGEMENT.DSBMANNSCHAFT_DETAIL.NOTIFICATION.DELETE_FAILURE.DESCRIPTION',
      severity:    NotificationSeverity.ERROR,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_DSBMANNSCHAFT_FAILURE)
      .subscribe(myNotification => {
        if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
          this.deleteLoading = false;
        }
      });

    this.notificationService.showNotification(notification);
  }
}
