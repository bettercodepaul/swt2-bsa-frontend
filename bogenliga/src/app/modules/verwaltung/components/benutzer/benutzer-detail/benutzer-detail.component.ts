import {Component, OnInit} from '@angular/core';
import {BENUTZER_DETAIL_CONFIG} from './benutzer-detail.config';
import {Response} from '../../../../shared/data-provider';
import {ButtonType, CommonComponent} from '../../../../shared/components';
import {BenutzerDataProviderService} from '../../../services/benutzer-data-provider.service';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined, isUndefined} from 'util';
import {BenutzerDO} from "../../../types/benutzer-do.class";
import {CredentialsDO} from "../../../../user/types/credentials-do.class";
import {CredentialsDTO} from "../../../../user/types/model/credentials-dto.class";

import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';

const ID_PATH_PARAM = 'id';
const NOTIFICATION_SAVE_BENUTZER = 'bentuzer_detail_save';


@Component({
  selector:    'bla-benutzer-detail',
  templateUrl: './benutzer-detail.component.html',
  styleUrls:   ['./benutzer-detail.component.scss']
})
export class BenutzerDetailComponent extends CommonComponent implements OnInit {

  public config = BENUTZER_DETAIL_CONFIG;
  public ButtonType = ButtonType;
  public currentBenutzer: BenutzerDO = new BenutzerDO();
  public currentCredentials: CredentialsDO = new CredentialsDO();
  public  verifyCredentials: CredentialsDO = new CredentialsDO();
  public currentCredentialsDTO: CredentialsDTO;

  public saveLoading = false;

  constructor(private benutzerDataProvider: BenutzerDataProviderService,
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
          this.currentCredentials = new CredentialsDO();
          this.verifyCredentials = new CredentialsDO();
          this.currentBenutzer = new BenutzerDO();
          this.loading = false;
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

    this.currentCredentialsDTO = new CredentialsDTO(this.currentCredentials.username, this.currentCredentials.password);
    this.benutzerDataProvider.create(this.currentCredentialsDTO)
        .then((response: Response<BenutzerDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            const notification: Notification = {
              id:          NOTIFICATION_SAVE_BENUTZER,
              title:       'MANAGEMENT.BENUTZER_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.BENUTZER_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_SAVE_BENUTZER)
                .subscribe(myNotification => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/benutzer');
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: Response<BenutzerDO>) => {
          console.log('Failed');
          this.saveLoading = false;


        });
    // show response message
  }

  public entityExists(): boolean {
    return this.currentBenutzer.id > 0;
  }

  private loadById(id: number) {
    this.benutzerDataProvider.findById(id)
        .then((response: Response<BenutzerDO>) => this.handleSuccess(response))
        .catch((response: Response<BenutzerDO>) => this.handleFailure(response));
  }

  private handleSuccess(response: Response<BenutzerDO>) {
    this.currentBenutzer = response.payload;
    this.loading = false;
  }

  private handleFailure(response: Response<BenutzerDO>) {
    this.loading = false;

  }

}
