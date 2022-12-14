import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {ButtonType, CommonComponentDirective} from '../../../../shared/components';
import {BogenligaResponse} from '../../../../shared/data-provider';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';
import {WettkampfklassenDataProviderService} from '../../../services/wettkampfklassen-data-provider.service';
import {WettkampfKlasseDO} from '../../../types/wettkampfklasse-do.class';
import {WETTKAMPFKLASSE_DETAIL_CONFIG} from './wettkampfklasse-detail.config';
import {SessionHandling} from '@shared/event-handling';
import {CurrentUserService, OnOfflineService} from '@shared/services';

const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_DSB_MITGLIED = 'dsb_mitglied_detail_delete';
const NOTIFICATION_DELETE_DSB_MITGLIED_SUCCESS = 'dsb_mitglied_detail_delete_success';
const NOTIFICATION_DELETE_DSB_MITGLIED_FAILURE = 'dsb_mitglied_detail_delete_failure';
const NOTIFICATION_SAVE_DSB_MITGLIED = 'dsb_mitglied_detail_save';
const NOTIFICATION_UPDATE_DSB_MITGLIED = 'dsb_mitglied_detail_update';

@Component({
  selector:    'bla-wettkampfklasse-detail',
  templateUrl: './wettkampfklasse-detail.component.html',
  styleUrls:   ['./wettkampfklasse-detail.component.scss']
})
export class WettkampfklasseDetailComponent extends CommonComponentDirective implements OnInit {
  public config = WETTKAMPFKLASSE_DETAIL_CONFIG;
  public ButtonType = ButtonType;
  public currentWettkampfklasse: WettkampfKlasseDO = new WettkampfKlasseDO();

  public deleteLoading = false;
  public saveLoading = false;

  private sessionHandling: SessionHandling;

  constructor(private wettkampfklasseDataProvider: WettkampfklassenDataProviderService,
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

    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        const id = params[ID_PATH_PARAM];
        if (id === 'add') {
          this.currentWettkampfklasse = new WettkampfKlasseDO();
          this.loading = false;
          this.deleteLoading = false;
          this.saveLoading = false;
        } else {
          this.loadById(params[ID_PATH_PARAM]);
        }
      }
    });
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

  public onSave(ignore: any): void {
    this.saveLoading = true;

    // persist
    this.wettkampfklasseDataProvider.create(this.currentWettkampfklasse)
        .then((response: BogenligaResponse<WettkampfKlasseDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            const notification: Notification = {
              id: NOTIFICATION_SAVE_DSB_MITGLIED,
              title: 'MANAGEMENT.WETTKAMPFKLASSE_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.WETTKAMPFKLASSE_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity: NotificationSeverity.INFO,
              origin: NotificationOrigin.USER,
              type: NotificationType.OK,
              userAction: NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_SAVE_DSB_MITGLIED)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/klassen');
                  }
                });

            this.notificationService.showNotification(notification);

          }
        }, (response: BogenligaResponse<WettkampfKlasseDO>) => {
          console.log('Failed');
          this.saveLoading = false;


        });
    // show response message
  }

  public onUpdate(ignore: any): void {
    this.saveLoading = true;

    // persist
    this.wettkampfklasseDataProvider.update(this.currentWettkampfklasse)
        .then((response: BogenligaResponse<WettkampfKlasseDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {

            const id = this.currentWettkampfklasse.id;

            const notification: Notification = {
              id: NOTIFICATION_UPDATE_DSB_MITGLIED + id,
              title: 'MANAGEMENT.WETTKAMPFKLASSE_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.WETTKAMPFKLASSE_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity: NotificationSeverity.INFO,
              origin: NotificationOrigin.USER,
              type: NotificationType.OK,
              userAction: NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_UPDATE_DSB_MITGLIED + id)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/klassen');
                  }
                });

            this.notificationService.showNotification(notification);
            this.saveLoading = false;
          }
        }, (response: BogenligaResponse<WettkampfKlasseDO>) => {
          console.log('Failed');
          this.saveLoading = false;
        });
    // show response message
  }


  public entityExists(): boolean {
    return this.currentWettkampfklasse.id >= 0;
  }

  private loadById(id: number) {
    this.wettkampfklasseDataProvider.findById(id)
        .then((response: BogenligaResponse<WettkampfKlasseDO>) => this.handleSuccess(response))
        .catch((response: BogenligaResponse<WettkampfKlasseDO>) => this.handleFailure(response));
  }

  private handleSuccess(response: BogenligaResponse<WettkampfKlasseDO>) {
    this.currentWettkampfklasse = response.payload;
    this.loading = false;
  }

  private handleFailure(response: BogenligaResponse<WettkampfKlasseDO>) {
    this.loading = false;

  }

  private handleDeleteSuccess(response: BogenligaResponse<void>): void {

    const notification: Notification = {
      id: NOTIFICATION_DELETE_DSB_MITGLIED_SUCCESS,
      title: 'MANAGEMENT.WETTKAMPFKLASSE_DETAIL.NOTIFICATION.DELETE_SUCCESS.TITLE',
      description: 'MANAGEMENT.WETTKAMPFKLASSE_DETAIL.NOTIFICATION.DELETE_SUCCESS.DESCRIPTION',
      severity: NotificationSeverity.INFO,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_DSB_MITGLIED_SUCCESS)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.router.navigateByUrl('/verwaltung/klassen');
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleDeleteFailure(response: BogenligaResponse<void>): void {

    const notification: Notification = {
      id: NOTIFICATION_DELETE_DSB_MITGLIED_FAILURE,
      title: 'MANAGEMENT.WETTKAMPFKLASSE_DETAIL.NOTIFICATION.DELETE_FAILURE.TITLE',
      description: 'MANAGEMENT.WETTKAMPFKLASSE_DETAIL.NOTIFICATION.DELETE_FAILURE.DESCRIPTION',
      severity: NotificationSeverity.ERROR,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_DSB_MITGLIED_FAILURE)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }
}

