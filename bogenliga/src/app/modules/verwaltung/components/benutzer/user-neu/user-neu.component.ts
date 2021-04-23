import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BogenligaResponse} from '@shared/data-provider';
import {isNullOrUndefined} from '@shared/functions';
import {CredentialsDO} from '@user/types/credentials-do.class';
import {CredentialsDTO} from '@user/types/model/credentials-dto.class';
import {ButtonType, CommonComponentDirective} from '../../../../shared/components';
import {BenutzerDataProviderService} from '../../../services/user-data-provider.service';
import {BenutzerDO} from '../../../types/user-do.class';
import {USER_NEU_CONFIG} from './user-neu.config';
import {DsbMitgliedDTO} from '@verwaltung/types/datatransfer/dsb-mitglied-dto.class';
import {DsbMitgliedDataProviderService} from '@verwaltung/services/dsb-mitglied-data-provider.service';

import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {VeranstaltungDTO} from '@verwaltung/types/datatransfer/veranstaltung-dto.class';

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

  constructor(private userDataProvider: BenutzerDataProviderService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private dsbMitgliedDataProvider: DsbMitgliedDataProviderService) {
    super();
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

  public onSave(ignore: any): void {
    this.saveLoading = true;

    // persist

    this.currentCredentialsDTO = new CredentialsDTO(this.currentCredentials.username, this.currentCredentials.password, this.selectedDsbMitgliedId, this.currentCredentials.using2FA);
    this.userDataProvider.create(this.currentCredentialsDTO)
        .then((response: BogenligaResponse<BenutzerDO>) => {
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
        }, (response: BogenligaResponse<BenutzerDO>) => {
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
