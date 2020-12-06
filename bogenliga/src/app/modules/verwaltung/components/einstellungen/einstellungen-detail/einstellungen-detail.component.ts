import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {ButtonType, CommonComponentDirective} from '../../../../shared/components';
import {BogenligaResponse, RequestResult} from '../../../../shared/data-provider';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';

import {DsbMitgliedDataProviderService} from '../../../services/dsb-mitglied-data-provider.service';
import {DsbMitgliedDO} from '@verwaltung/types/dsb-mitglied-do.class';

import {EINSTELLUNGEN_DETAIL_CONFIG} from './einstellungen-detail.config';
import {CurrentUserService, UserPermission} from '@shared/services';
const ID_PATH_PARAM = 'id';
const NOTIFICATION_SAVE_EINSTELLUNGEN = 'einstellungen_detail_save';
const NOTIFICATION_DUPLICATE_EINSTELLUNGEN = 'einstellungen_detail_duplicate';

@Component({
  selector: 'bla-einstellungen-detail',
  templateUrl: './einstellungen-detail.component.html',
  styleUrls: ['./einstellungen-detail.component.scss']
})
export class EinstellungenDetailComponent extends CommonComponentDirective implements OnInit {

  public config = EINSTELLUNGEN_DETAIL_CONFIG;
  public ButtonType = ButtonType;
  public deleteLoading = false;
  public saveLoading = false;

  public currentMitglied;
  public loadById;

  constructor(private dsbMitgliedDataProvider: DsbMitgliedDataProviderService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private currentUserService: CurrentUserService) {
    super();
  }

  ngOnInit() {
    this.loading = true;
    this.notificationService.discardNotification();


    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        const id = params[ID_PATH_PARAM];
        if (id === 'add') {
          this.currentMitglied = new DsbMitgliedDO();
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
    this.dsbMitgliedDataProvider.create(this.currentMitglied)
        .then((response: BogenligaResponse<DsbMitgliedDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            const notification: Notification = {
              id: NOTIFICATION_SAVE_EINSTELLUNGEN,
              title: 'MANAGEMENT.EINSTELLUNGEN_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.EINSTELLUNGEN_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity: NotificationSeverity.INFO,
              origin: NotificationOrigin.USER,
              type: NotificationType.OK,
              userAction: NotificationUserAction.ACCEPTED
            };

            this.notificationService.observeNotification(NOTIFICATION_SAVE_EINSTELLUNGEN)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/einstellungen');
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: BogenligaResponse<DsbMitgliedDO>) => {
          console.log('Failed');
          if (response.result === RequestResult.DUPLICATE_DETECTED) {
            const notification: Notification = {
              id: NOTIFICATION_DUPLICATE_EINSTELLUNGEN,
              title: 'MANAGEMENT.EINSTELLUNGEN_DETAIL.NOTIFICATION.DUPLICATE.TITLE',
              description: 'MANAGEMENT.EINSTELLUNGEN_DETAIL.NOTIFICATION.DUPLICATE.DESCRIPTION',
              severity: NotificationSeverity.INFO,
              origin: NotificationOrigin.USER,
              type: NotificationType.OK,
              userAction: NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_DUPLICATE_EINSTELLUNGEN)
                .subscribe((myNotification) => {
                });

            this.notificationService.showNotification(notification);
          }
          this.saveLoading = false;


        });
    // show response message
  }


  public entityExists(): boolean {
    return this.currentMitglied.id >= 0;
  }

}
