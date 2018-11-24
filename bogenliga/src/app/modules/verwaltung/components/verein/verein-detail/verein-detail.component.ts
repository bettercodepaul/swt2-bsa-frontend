import {Component, OnInit} from '@angular/core';
import {
  Notification,
  NotificationOrigin,
  NotificationService, NotificationSeverity, NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';
import {Response} from '../../../../shared/data-provider';
import {ButtonType, CommonComponent} from '../../../../shared/components';
import {isNullOrUndefined, isUndefined} from 'util';
import {DsbMitgliedDO} from '../../../types/dsb-mitglied-do.class';
import {ActivatedRoute, Router} from '@angular/router';
import {VereinDO} from '../../../types/verein-do.class';
import {VereinDataProviderService} from '../../../services/verein-data-provider.service';
import {VEREIN_DETAIL_CONFIG} from './verein-detail.config';

const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_VEREIN = 'verein_detail_delete';
const NOTIFICATION_DELETE_VEREIN_SUCCESS = 'verein_detail_delete_success';
const NOTIFICATION_DELETE_VEREIN_FAILURE = 'verein_detail_delete_failure';
const NOTIFICATION_SAVE_VEREIN = 'verein_detail_save';
const NOTIFICATION_UPDATE_VEREIN = 'verein_detail_update';


interface CurrentRegion {
  id: number;
  name: string;
}

@Component({
  selector:    'bla-verein-detail',
  templateUrl: './verein-detail.component.html',
  styleUrls:   ['./verein-detail.component.scss']
})
export class VereinDetailComponent extends CommonComponent implements OnInit {

  public config = VEREIN_DETAIL_CONFIG;
  public ButtonType = ButtonType;
  public currentVerein: VereinDO = new VereinDO();

  public deleteLoading = false;
  public saveLoading = false;

  public regionenMock = [
    {
      id:   1,
      name: 'Reutlingen'
    },
    {
      id:   2,
      name: 'Metzingen'
    }
  ];
  public region: CurrentRegion = this.regionenMock[0];



  constructor(private vereinProvider: VereinDataProviderService,
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
          this.currentVerein = new VereinDO();
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
    this.vereinProvider.create(this.currentVerein)
        .then((response: Response<VereinDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            const notification: Notification = {
              id:          NOTIFICATION_SAVE_VEREIN,
              title:       'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_SAVE_VEREIN)
                .subscribe(myNotification => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/vereine/' + response.payload.id);
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
    this.vereinProvider.update(this.currentVerein)
        .then((response: Response<VereinDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {

            const id = this.currentVerein.id;

            const notification: Notification = {
              id:          NOTIFICATION_UPDATE_VEREIN + id,
              title:       'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_UPDATE_VEREIN + id)
                .subscribe(myNotification => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/vereine');
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

  public onDelete(ignore: any): void {
    this.deleteLoading = true;
    this.notificationService.discardNotification();

    const id = this.currentVerein.id;

    const notification: Notification = {
      id:               NOTIFICATION_DELETE_VEREIN + id,
      title:            'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_VEREIN + id)
        .subscribe(myNotification => {

          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.vereinProvider.deleteById(id)
                .then(response => this.handleDeleteSuccess(response))
                .catch(response => this.handleDeleteFailure(response));
          }
        });

    this.notificationService.showNotification(notification);
  }

  public entityExists(): boolean {
    return this.currentVerein.id > 0;
  }

  private loadById(id: number) {
    this.vereinProvider.findById(id)
        .then((response: Response<VereinDO>) => this.handleSuccess(response))
        .catch((response: Response<VereinDO>) => this.handleFailure(response));
  }

  private handleSuccess(response: Response<VereinDO>) {
    this.currentVerein = response.payload;
    this.loading = false;
  }

  private handleFailure(response: Response<VereinDO>) {
    this.loading = false;
  }

  private handleDeleteSuccess(response: Response<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_VEREIN_SUCCESS,
      title:       'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.DELETE_SUCCESS.TITLE',
      description: 'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.DELETE_SUCCESS.DESCRIPTION',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_VEREIN_SUCCESS)
        .subscribe(myNotification => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.router.navigateByUrl('/verwaltung/klassen');
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleDeleteFailure(response: Response<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_VEREIN_FAILURE,
      title:       'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.DELETE_FAILURE.TITLE',
      description: 'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.DELETE_FAILURE.DESCRIPTION',
      severity:    NotificationSeverity.ERROR,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_VEREIN_FAILURE)
        .subscribe(myNotification => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

}
