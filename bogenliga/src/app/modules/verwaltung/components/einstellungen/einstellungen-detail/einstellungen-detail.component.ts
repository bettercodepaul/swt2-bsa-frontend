import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {ButtonType, CommonComponentDirective} from '../../../../shared/components';
import {EINSTELLUNGEN_DETAIL_CONFIG} from './einstellungen-detail.config';
import {
  CurrentUserService,
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
} from '@shared/services';
import {EinstellungenDO} from '@verwaltung/types/einstellungen-do.class';
import {EinstellungenProviderService} from '@verwaltung/services/einstellungen-data-provider.service';
import {BogenligaResponse} from '@shared/data-provider';
import {EinstellungenDTO} from '@verwaltung/types/datatransfer/einstellungen-dto.class';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {SessionHandling} from '@shared/event-handling';

const ID_PATH_PARAM = 'id';
const NOTIFICATION_UPDATE_EINSTELLUNG = 'einstellung_detail_update';
const NOTIFICATION_SAVE_EINSTELLUNG = 'einstellung_detail_save';
const NOTIFICATION_CREATE_EINSTELLUNG = 'einstellung_detail_save';

@Component({
  selector: 'bla-einstellungen-detail',
  templateUrl: './einstellungen-detail.component.html',
  styleUrls: ['./einstellungen-detail.component.scss']
})
export class EinstellungenDetailComponent extends CommonComponentDirective implements OnInit {
  public config = EINSTELLUNGEN_DETAIL_CONFIG;
  public ButtonType = ButtonType;
  public currentEinstellung: EinstellungenDO = new EinstellungenDO();
  public neucurrentEinstellung: EinstellungenDO = new EinstellungenDO();

  public currentMitgliedNat: string;
  public deleteLoading = false;
  public saveLoading = false;
  public rows: TableRow[];
  public id;
  public test = 'app.bogenliga.frontend.autorefresh.active';

  private sessionHandling: SessionHandling;


  constructor(private einstellungenDataProvider: EinstellungenProviderService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private einstellungenProviderService: EinstellungenProviderService,
    private currentUserService: CurrentUserService) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService);
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

  public entityExists(): boolean {
    return this.currentEinstellung.id >= 0;
  }


  public onSave(ignore: any): void {

    this.saveLoading = true;
    this.currentEinstellung.key = this.neucurrentEinstellung.key;

    const notificationSave: Notification = {
      id:          NOTIFICATION_SAVE_EINSTELLUNG,
      title:       'MANAGEMENT.EINSTELLUNG_DETAIL.NOTIFICATION.SAVE.TITLE',
      description: 'MANAGEMENT.EINSTELLUNG_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,

    };

    this.notificationService.showNotification(notificationSave);

  }

  ngOnInit() {

    this.loading = true;
    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        this.id = params[ID_PATH_PARAM];
        if (this.id === 'add') {
          this.currentEinstellung = new EinstellungenDO();

          this.loading = false;
          this.deleteLoading = false;
          this.saveLoading = false;
        } else {
          this.loadById(params[ID_PATH_PARAM]);
        }
      }
    });

  }

  private loadById(id: string) {

    this.einstellungenProviderService.findById(id)
        .then((response: BogenligaResponse<EinstellungenDO>) => this.handleSuccess(response))
        .catch((response: BogenligaResponse<EinstellungenDO>) => this.handleSuccess(response));
  }

  private handleSuccess(response: BogenligaResponse<EinstellungenDO>) {
    this.currentEinstellung = response.payload;
    this.loading = false;

  }

  changevalue($event: MouseEvent) {
    const notificationUpdateError: Notification = {

      id:          NOTIFICATION_UPDATE_EINSTELLUNG,
      title:       'MANAGEMENT.EINSTELLUNG_DETAIL.NOTIFICATION.EINSTELLUNGEN_ERROR.TITLE',
      description: '',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,

    };

    this.saveLoading = true;

    const tempEinstellung = this.neucurrentEinstellung.value;

    if (this.currentEinstellung.regex != null) {
      const regex = new RegExp(this.currentEinstellung.regex);
      if (!regex.test(tempEinstellung)) {
        switch (this.currentEinstellung.key) {
          case 'SMTPEmail':
            notificationUpdateError.description = 'MANAGEMENT.EINSTELLUNG_DETAIL.NOTIFICATION.EINSTELLUNGEN_ERROR.DESCRIPTION.EMAIL';
            break;
          case 'SMTPPort':
            notificationUpdateError.description = 'MANAGEMENT.EINSTELLUNG_DETAIL.NOTIFICATION.EINSTELLUNGEN_ERROR.DESCRIPTION.PORT';
            break;
          case 'SMTPHost':
            notificationUpdateError.description = 'MANAGEMENT.EINSTELLUNG_DETAIL.NOTIFICATION.EINSTELLUNGEN_ERROR.DESCRIPTION.HOST';
            break;
          default:
            notificationUpdateError.description = 'MANAGEMENT.EINSTELLUNG_DETAIL.NOTIFICATION.EINSTELLUNGEN_ERROR.DESCRIPTION.DEFAULT';
            break;
        }
      }
    }

    if (notificationUpdateError.description !== '') {
        this.notificationService.showNotification(notificationUpdateError);
      } else {
        this.currentEinstellung.value = this.neucurrentEinstellung.value;
        this.einstellungenProviderService.update(this.currentEinstellung)
            .then((response: BogenligaResponse<EinstellungenDO>) => {
              const notificationUpdate: Notification = {

                id:          NOTIFICATION_UPDATE_EINSTELLUNG,
                title:       'MANAGEMENT.EINSTELLUNG_DETAIL.NOTIFICATION.EDIT.TITLE',
                description: 'MANAGEMENT.EINSTELLUNG_DETAIL.NOTIFICATION.EDIT.DESCRIPTION',
                severity:    NotificationSeverity.INFO,
                origin:      NotificationOrigin.USER,
                type:        NotificationType.OK,

              };

              this.notificationService.showNotification(notificationUpdate);

              const id = this.currentEinstellung.id;

              this.navigateToDetailDialog();

            }, (response: BogenligaResponse<EinstellungenDO>) => {

              this.saveLoading = false;
            });
      }
  }

 // Aufruf der Funktion wo ein neuer Eintrag erstellt wird
  createEinstellung($event: MouseEvent) {
    this.saveLoading = true;

    this.einstellungenProviderService.findAll()
        .then((response: BogenligaResponse<EinstellungenDTO[]> ) => this.currentEinstellung.id = response.payload.length + 1);

    this.einstellungenProviderService.create(this.currentEinstellung)
        .then((response: BogenligaResponse<EinstellungenDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {

            const notification: Notification = {
              id:          NOTIFICATION_CREATE_EINSTELLUNG,
              title:       'MANAGEMENT.EINSTELLUNG_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.EINSTELLUNG_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,

            };

            this.notificationService.showNotification(notification);

          }
          this.navigateToDetailDialog();
        }, (response: BogenligaResponse<EinstellungenDO> ) => {
          this.saveLoading = false;
        });

  }

  private navigateToDetailDialog() {
    this.router.navigateByUrl('/verwaltung/einstellungen');
  }
}


