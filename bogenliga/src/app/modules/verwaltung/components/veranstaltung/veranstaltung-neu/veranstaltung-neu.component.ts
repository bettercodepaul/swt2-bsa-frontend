import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BogenligaResponse} from '@shared/data-provider';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {CredentialsDO} from '@user/types/credentials-do.class';
import {CredentialsDTO} from '@user/types/model/credentials-dto.class';
import {ButtonType, CommonComponent} from '../../../../shared/components';
import {UserProfileDataProviderService} from '../../../../user/services/user-profile-data-provider.service';
import {UserProfileDTO} from '../../../../user/types/model/user-profile-dto.class';
import {UserProfileDO} from '../../../../user/types/user-profile-do.class';
import {LigaDataProviderService} from '../../../services/liga-data-provider.service';
import {LigaDTO} from '../../../types/datatransfer/liga-dto.class';
import {LigaDO} from '../../../types/liga-do.class';
import {VeranstaltungDataProviderService} from '../../../services/veranstaltung-data-provider.service';
import {VeranstaltungDTO} from '../../../types/datatransfer/veranstaltung-dto.class';
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
import {RegionDO} from '@verwaltung/types/region-do.class';
import {RegionDTO} from '@verwaltung/types/datatransfer/region-dto.class';

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
  public currentVeranstaltung: VeranstaltungDO = new VeranstaltungDO();

  public currentLiga: LigaDO = new LigaDO();
  public allLiga: Array<LigaDO> = [new LigaDO()];

  public currentUser: UserProfileDO = new UserProfileDO();
  public allUser: Array<UserProfileDO> = [new UserProfileDO()];

  /*public currentWettkampftyp: WettkampftypDO() = new WettkampftypDO();
  public allWettkampftyp: Array<WettkampftypDO()> = [WettkampftypDO()];*/



  public currentCredentials: CredentialsDO = new CredentialsDO();
  public verifyCredentials: CredentialsDO = new CredentialsDO();
  public currentCredentialsDTO: CredentialsDTO;
  public selectedDTO: PlaygroundVersionedDataObject;
  public saveLoading = false;

  constructor(private veranstaltungProvider: VeranstaltungDataProviderService,
    private userProvider: UserProfileDataProviderService,
    private ligaProvider: LigaDataProviderService,
    //private wettkampftypDataProvider: WettkampfDataProviderService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.loading = true;
    this.notificationService.discardNotification();
    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        this.id = params[ID_PATH_PARAM];
        if (this.id === 'add') {
          this.currentVeranstaltung = new VeranstaltungDO();

          this.loadUser();
          this.loadLiga();


          this.loading = false;
          this.saveLoading = false;
        } else {
          this.loadById(params[ID_PATH_PARAM]);
        }
      }
    });
    this.loading = false;

  }

  public onSave(ignore: any): void {
    this.saveLoading = true;

    // persist

    this.currentCredentialsDTO = new CredentialsDTO(this.currentCredentials.username, this.currentCredentials.password);
    /*this.veranstaltungProvider.create(this.currentCredentialsDTO)
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


  private loadUser() {
    this.userProvider.findAll()
        .then( (response: BogenligaResponse<UserProfileDO[]>) => this.handleUserResponseArraySuccess (response))
        .catch((response: BogenligaResponse<UserProfileDTO[]>) => this.handleUserResponseArrayFailure (response));
  }
  private loadLiga() {
    this.ligaProvider.findAll()
        .then( (response: BogenligaResponse<LigaDO[]>) => this.handleLigaResponseArraySuccess (response))
        .catch((response: BogenligaResponse<LigaDTO[]>) => this.handleLigaResponseArrayFailure (response));
  }


  private handleLigaResponseArraySuccess(response: BogenligaResponse<LigaDO[]>): void {
    this.allLiga = [];
    this.allLiga = response.payload;
    if (this.id === 'add') {
      this.currentLiga = this.allLiga[0];
    } else {
      this.currentLiga = this.allLiga.filter((uebergeordnet) => uebergeordnet.id === this.currentLiga.ligaUebergeordnetId)[0];
    }
    this.loading = false;
  }

  private handleLigaResponseArrayFailure(response: BogenligaResponse<LigaDTO[]>): void {
    this.allLiga = [];
    this.loading = false;
  }

  private handleUserResponseArraySuccess(response: BogenligaResponse<UserProfileDO[]>): void {
    this.allUser = [];
    this.allUser = response.payload;
    if (this.id === 'add') {
      this.currentUser = this.allUser[0];
    } else {
      this.currentUser = this.allUser.filter((user) => user.id === this.currentLiga.ligaVerantwortlichId)[0];
    }
    this.loading = false;
  }

  private handleUserResponseArrayFailure(response: BogenligaResponse<UserProfileDTO[]>): void {
    this.allUser = [];
    this.loading = false;
  }

}
