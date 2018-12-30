import { Component, OnInit } from '@angular/core';
import {CommonComponent} from '../../../../shared/components/common';
import {LIGA_DETAIL_CONFIG} from '../../liga/liga-detail/liga-detail.config';
import {LigaDataProviderService} from '../../../services/liga-data-provider.service';
import {ButtonType} from '../../../../shared/components/buttons';
import {LigaDO} from '../../../types/liga-do.class';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity, NotificationType, NotificationUserAction
} from '../../../../shared/services/notification';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined, isUndefined} from 'util';
import {Response} from '../../../../shared/data-provider';


const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_LIGA = 'liga_detail_delete';
const NOTIFICATION_DELETE_LIGA_SUCCESS = 'liga_detail_delete_success';
const NOTIFICATION_DELETE_LIGA_FAILURE = 'liga_detail_delete_failure';
const NOTIFICATION_SAVE_LIGA = 'liga_detail_save';
const NOTIFICATION_UPDATE_LIGA = 'liga_detail_update';

@Component({
  selector: 'bla-liga-detail',
  templateUrl: './liga-detail.component.html',
  styleUrls: ['./liga-detail.component.scss']
})
export class LigaDetailComponent extends CommonComponent implements OnInit {
  public config = LIGA_DETAIL_CONFIG;
  public ButtonType = ButtonType;
  public currentLiga: LigaDO = new LigaDO();

  public deleteLoading = false;
  public saveLoading = false;

  constructor(private ligaDataProvider: LigaDataProviderService,
    private router: Router,
    private route: AcitvatedRoute,
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
          this.currentLiga = new LigaDO();
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
    this.ligaDataProvider.create(this.currentLiga)
        .then((response: Response<LigaDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            const notification: Notification = {
              id:          NOTIFICATION_SAVE_LIGA,
              title:       'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_SAVE_LIGA)
                .subscribe(myNotification => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/liga/' + response.payload.id);
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: Response<LigaDO>) => {
          console.log('Failed');
          this.saveLoading = false;


        });
    // show response message
  }

  public onUpdate(ignore: any): void {
    this.saveLoading = true;

    // persist
    this.ligaDataProvider.update(this.currentLiga)
        .then((response: Response<LigaDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {

            const id = this.currentLiga.id;

            const notification: Notification = {
              id:          NOTIFICATION_UPDATE_LIGA + id,
              title:       'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_UPDATE_LIGA + id)
                .subscribe(myNotification => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/liga');
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: Response<LigaDO>) => {
          console.log('Failed');
          this.saveLoading = false;
        });
  }

  public onDelete(ignore: any): void {
    this.deleteLoading = true;
    this.notificationService.discardNotification();

    const id = this.currentLiga.id;

    const notification: Notification = {
      id:               NOTIFICATION_DELETE_LIGA + id,
      title:            'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.DSBMITGLIEDER_DETAIL.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_LIGA + id)
        .subscribe(myNotification => {

          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.ligaDataProvider.deleteById(id)
                .then(response => this.handleDeleteSuccess(response))
                .catch(response => this.handleDeleteFailure(response));
          }
        });

    this.notificationService.showNotification(notification);
  }

  public entityExists(): boolean {
    return this.currentLiga.id > 0;
  }

  private loadById(id: number) {
    this.ligaDataProvider.findById(id)
        .then((response: Response<LigaDO>) => this.handleSuccess(response))
        .catch((response: Response<LigaDO>) => this.handleFailure(response));
  }

  private handleSuccess(response: Response<LigaDO>) {
    this.currentLiga = response.payload;
    this.loading = false;
  }

  private handleFailure(response: Response<LigaDO>) {
    this.loading = false;

  }

  private handleDeleteSuccess(response: Response<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_LIGA_SUCCESS,
      title:       'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.DELETE_SUCCESS.TITLE',
      description: 'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.DELETE_SUCCESS.DESCRIPTION',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_LIGA_SUCCESS)
        .subscribe(myNotification => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.router.navigateByUrl('/verwaltung/liga');
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleDeleteFailure(response: Response<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_LIGA_FAILURE,
      title:       'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.DELETE_FAILURE.TITLE',
      description: 'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.DELETE_FAILURE.DESCRIPTION',
      severity:    NotificationSeverity.ERROR,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_LIGA_FAILURE)
        .subscribe(myNotification => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

}
