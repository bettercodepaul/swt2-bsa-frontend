import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BogenligaResponse} from '@shared/data-provider';
import {isNullOrUndefined} from '@shared/functions';
import {CredentialsDO} from '@user/types/credentials-do.class';
import {CredentialsDTO} from '@user/types/model/credentials-dto.class';
import {ButtonType, CommonComponentDirective} from '../../../../shared/components';
import {UserDataProviderService} from '../../../services/user-data-provider.service';
import {UserDO} from '../../../types/user-do.class';
import {USER_NEU_CONFIG} from './user-neu.config';
import {DsbMitgliedDTO} from '@verwaltung/types/datatransfer/dsb-mitglied-dto.class';
import {DsbMitgliedDataProviderService} from '@verwaltung/services/dsb-mitglied-data-provider.service';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';


import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';
import {SessionHandling} from '@shared/event-handling';
import {CurrentUserService, OnOfflineService} from '@shared/services';

const ID_PATH_PARAM = 'id';
const NOTIFICATION_SAVE_USER = 'user_neu_save';


@Component({
  selector:    'bla-user-neu',
  templateUrl: './user-neu.component.html',
  styleUrls:   ['./user-neu.component.scss']
})
export class UserNeuComponent extends CommonComponentDirective implements OnInit {

  public config = USER_NEU_CONFIG;
  public ButtonType = ButtonType;
  public currentCredentials: CredentialsDO = new CredentialsDO();
  public verifyCredentials: CredentialsDO = new CredentialsDO();
  public currentCredentialsDTO: CredentialsDTO;
  public qrCode: string;

  public saveLoading = false;
  public dsbMitgliederRows: DsbMitgliedDTO[];
  public selectedDTOs: DsbMitgliedDTO[];
  public selectedDsbMitgliedId: number;
  public multipleSelections = true;
  public ActionButtonColors = ActionButtonColors;
  private sessionHandling: SessionHandling;

  constructor(private userDataProvider: UserDataProviderService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private dsbMitgliedDataProvider: DsbMitgliedDataProviderService,
    private currentUserService: CurrentUserService,
    private onOfflineService: OnOfflineService) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);
  }

  ngOnInit() {
    this.loading = true;
    this.notificationService.discardNotification();
    // TODO laden der DSB-Mitglieder in selection-list
    this.loadSelectorRows();

    this.route.params.subscribe((params) => {
      this.currentCredentials = new CredentialsDO();
      this.verifyCredentials = new CredentialsDO();
    });
    this.loading = false;

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

    this.currentCredentialsDTO = new CredentialsDTO(this.currentCredentials.username, this.currentCredentials.password, this.selectedDsbMitgliedId, this.currentCredentials.using2FA);
    this.userDataProvider.create(this.currentCredentialsDTO)
        .then((response: BogenligaResponse<UserDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);


            const notification: Notification = {
              id:          NOTIFICATION_SAVE_USER,
              title:       'MANAGEMENT.USER_NEU.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.USER_NEU.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };


            this.notificationService.observeNotification(NOTIFICATION_SAVE_USER)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    if (this.currentCredentialsDTO.using2FA) {

                      this.qrCode = response.payload.qrCode;
                      console.log('QR:');
                      console.log(this.qrCode);
                    } else {
                      this.router.navigateByUrl('/verwaltung/user');
                    }
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: BogenligaResponse<UserDO>) => {
          console.log('Failed');
          this.saveLoading = false;


        });
    // show response message
  }

  private loadById(id: number) {
    this.loading = false;
  }

  private loadSelectorRows() {
    this.loading = true;

    this.dsbMitgliedDataProvider.findAll()
      .then((response: BogenligaResponse<DsbMitgliedDTO[]>) => this.handleLoadTableRowsSuccess(response))
      .catch((response: BogenligaResponse<DsbMitgliedDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private handleLoadTableRowsFailure(response: BogenligaResponse<DsbMitgliedDTO[]>): void {
    this.dsbMitgliederRows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<DsbMitgliedDTO[]>): void {
    this.dsbMitgliederRows = []; // reset array to ensure change detection
    if (response.payload.length <= 0) {
      this.loading = false;
    }
    for (const dsbmitgliederPayload of response.payload) {
      const selectorContentRow: DsbMitgliedDTO = new DsbMitgliedDTO();
      selectorContentRow.nachname = dsbmitgliederPayload.nachname + ',' + dsbmitgliederPayload.vorname + ' No.:' + dsbmitgliederPayload.mitgliedsnummer;
      selectorContentRow.id = dsbmitgliederPayload.id;
      this.dsbMitgliederRows.push(selectorContentRow);
     }
    this.loading = false;
  }
  public getVersionedDataObjects(): DsbMitgliedDTO[] {
    return this.dsbMitgliederRows;
  }
  public onSelect($event: DsbMitgliedDTO[]): void {
    this.selectedDTOs = [];
    this.selectedDTOs = $event;
    if (!!this.selectedDTOs && this.selectedDTOs.length > 0) {
      this.selectedDsbMitgliedId = this.selectedDTOs[0].id;
    }
  }


}
