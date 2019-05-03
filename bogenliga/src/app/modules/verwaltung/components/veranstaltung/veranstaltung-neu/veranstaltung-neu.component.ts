import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BogenligaResponse} from '@shared/data-provider';
import {isNullOrUndefined} from '@shared/functions';
import {CredentialsDO} from '@user/types/credentials-do.class';
import {CredentialsDTO} from '@user/types/model/credentials-dto.class';
import {ButtonType, CommonComponent} from '../../../../shared/components';
import {VeranstaltungDataProviderService} from '../../../services/veranstaltung-data-provider.service';
import {VeranstaltungDO} from '../../../types/veranstaltung-do.class';
import {VERANSTALTUNG_NEU_CONFIG} from './veranstaltung-neu.config';

import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';
import {PlaygroundVersionedDataObject} from '../../../../playground/components/playground/types/playground-versioned-data-object.class';

const ID_PATH_PARAM = 'id';
const NOTIFICATION_SAVE_VERANSTALTUNG = 'veranstaltung_neu_save';


@Component({
  selector:    'bla-veranstaltung-neu',
  templateUrl: './veranstaltung-neu.component.html',
  styleUrls:   ['./veranstaltung-neu.component.scss']
})
export class VeranstaltungNeuComponent extends CommonComponent implements OnInit {

  public config = VERANSTALTUNG_NEU_CONFIG;
  public ButtonType = ButtonType;
  public currentCredentials: CredentialsDO = new CredentialsDO();
  public verifyCredentials: CredentialsDO = new CredentialsDO();
  public currentCredentialsDTO: CredentialsDTO;
  public selectedDTO: PlaygroundVersionedDataObject;

  public saveLoading = false;

  constructor(private benutzerDataProvider: VeranstaltungDataProviderService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.loading = true;
    this.notificationService.discardNotification();


    this.route.params.subscribe((params) => {
      this.currentCredentials = new CredentialsDO();
      this.verifyCredentials = new CredentialsDO();
    });
    this.loading = false;

  }

  public onSave(ignore: any): void {
    this.saveLoading = true;

    // persist

    this.currentCredentialsDTO = new CredentialsDTO(this.currentCredentials.username, this.currentCredentials.password);
    /*this.benutzerDataProvider.create(this.currentCredentialsDTO)
        .then((response: BogenligaResponse<VeranstaltungDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            const notification: Notification = {
              id:          NOTIFICATION_SAVE_VERANSTALTUNG,
              title:       'MANAGEMENT.VERANSTALTUNG_NEU.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.VERANSTALTUNG_NEU.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_SAVE_VERANSTALTUNG)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/veranstaltung');
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: BogenligaResponse<VeranstaltungDO>) => {
          console.log('Failed');
          this.saveLoading = false;


        });*/
    // show response message
  }

  private loadById(id: number) {
    this.loading = false;
  }
  public onSelect($event: PlaygroundVersionedDataObject): void {
    this.selectedDTO = $event;
  }

  public getVersionedDataObjects(): PlaygroundVersionedDataObject[] {
    return [
      new PlaygroundVersionedDataObject(1, 'Schütze 1'),
      new PlaygroundVersionedDataObject(2, 'Schütze 2'),
      new PlaygroundVersionedDataObject(3, 'Schütze 3'),
      new PlaygroundVersionedDataObject(4, 'Schütze 4'),
      new PlaygroundVersionedDataObject(5, 'Schütze 5'),
    ];
  }

}
