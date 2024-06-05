import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  AlertType,
  ButtonType,
  CommonComponentDirective,
  hideLoadingIndicator,
  showDeleteLoadingIndicatorIcon,
  toTableRows
} from '@shared/components';
import {BogenligaResponse} from '@shared/data-provider';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '@shared/services';
import {UserProfileDataProviderService} from '@user/services/user-profile-data-provider.service';
import {UserDataProviderService} from '../../../services/user-data-provider.service';
import {UserProfileDTO} from '@user/types/model/user-profile-dto.class';
import {UserProfileDO} from '@user/types/user-profile-do.class';
import {VeranstaltungDataProviderService} from '../../../services/veranstaltung-data-provider.service';
import {RegionDataProviderService} from '../../../services/region-data-provider.service';
import {VeranstaltungDO} from '../../../types/veranstaltung-do.class';
import {VERANSTALTUNG_DETAIL_CONFIG, VERANSTALTUNG_DETAIL_TABLE_Config} from './veranstaltung-detail.config';
import {LigaDataProviderService} from '../../../services/liga-data-provider.service';
import {LigaDO} from '@verwaltung/types/liga-do.class';
import {LigaDTO} from '@verwaltung/types/datatransfer/liga-dto.class';
import {WettkampftypDataProviderService} from '../../../services/wettkampftyp-data-provider.service';
import {WettkampftypDO} from '@verwaltung/types/wettkampftyp-do.class';
import {WettkampftypDTO} from '@verwaltung/types/datatransfer/wettkampftyp-dto.class';
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';
import {DsbMannschaftDataProviderService} from '../../../services/dsb-mannschaft-data-provider.service';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {LigatabelleDataProviderService} from '../../../../ligatabelle/services/ligatabelle-data-provider.service';
import {LigatabelleErgebnisDO} from '../../../../ligatabelle/types/ligatabelle-ergebnis-do.class';
import {MannschaftSortierungDataProviderService} from '@verwaltung/services/mannschaftSortierung-data-provider.service';
import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';
import {MannschaftSortierungDO} from '@verwaltung/types/mannschaftSortierung-do.class';
import {MatchDataProviderService} from '@verwaltung/services/match-data-provider.service';
import {TableActionType} from '@shared/components/tables/types/table-action-type.enum';
import {UserRolleDO} from '@verwaltung/types/user-rolle-do.class';
import {UserRolleDTO} from '@verwaltung/types/datatransfer/user-rolle-dto.class';
import {SessionHandling} from '@shared/event-handling';
import {CurrentUserService, OnOfflineService, UserPermission} from '@shared/services';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';
import {VereinDO} from '@verwaltung/types/verein-do.class';

import {MatchDO} from '@verwaltung/types/match-do.class';
import { RequestResult } from '@shared/data-provider/types/request-result.enum';
import {DsbMitgliedDO} from '@verwaltung/types/dsb-mitglied-do.class';




const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_VERANSTALTUNG = 'veranstaltung_detail_delete';
const NOTIFICATION_DELETE_VERANSTALTUNG_SUCCESS = 'veranstaltung_detail_delete_success';
const NOTIFICATION_DELETE_VERANSTALTUNG_FAILURE = 'veranstaltung_detail_delete_failure';
const NOTIFICATION_SAVE_VERANSTALTUNG = 'veranstaltung_detail_save';
const NOTIFICATION_SAVE_VERANSTALTUNG_FAILURE = 'veranstaltung_detail_save_failure';
const NOTIFICATION_UPDATE_VERANSTALTUNG = 'veranstaltung_detail_update';
const NOTIFICATION_UPDATE_VERANSTALTUNG_FAILURE = 'veranstaltung_detail_update_failure';
const NOTIFICATION_SAVE_SORTIERUNG = 'veranstaltung_detail_save_sortierung';
const NOTIFICATION_INIT_LIGATABELLE_SUC = 'init_Ligatabelle_suc';
const NOTIFICATION_INIT_LIGATABELLE_FAIL = 'init_Ligatabelle_fail';
const NOTIFICATION_COPY_MANNSCHAFTEN_FAILURE = 'veranstaltung_detail_copy_failure';
const NOTIFICATION_COPY_MANNSCHAFTEN_FAILURE_SIZEDIFF = 'veranstaltung_detail_copy_failure_sizediff';
const NOTIFICATION_DELETE_MANNSCHAFT = 'mannschaft_detail_delete';
const NOTIFICATION_FINISH_VERANSTALTUNG = 'veranstaltung_detail_finish';
const NOTIFICATION_CREATE_PLATZHALTER = 'platzhalter_create';
const NOTIFICATION_CREATE_PLATZHALTER_FAILURE = 'platzhalter_create_failure';



@Component({
  selector:    'bla-veranstaltung-detail',
  templateUrl: './veranstaltung-detail.component.html',
  styleUrls:   ['./veranstaltung-detail.component.scss']
})


export class VeranstaltungDetailComponent extends CommonComponentDirective implements OnInit {
  currentDisziplin: any;
  allDisziplin: any;

  public config = VERANSTALTUNG_DETAIL_CONFIG;
  public tableConfig = VERANSTALTUNG_DETAIL_TABLE_Config;
  public ButtonType = ButtonType;

  public currentVeranstaltung: VeranstaltungDO = new VeranstaltungDO();
  public lastVeranstaltung: VeranstaltungDO = new VeranstaltungDO();

  public currentLiga: LigaDO = new LigaDO();
  public allLiga: Array<LigaDO> = [new LigaDO()];
  public currentSelectedVeranstaltungPhase: string;

  public allTeamAmount: Array<number> = [8, 6, 4];


  public allVeranstaltungPhases: Array<string>  = ['Geplant', 'Laufend'];
  public isPhaseSelectDisabled = true;
  public disabledVeranstaltungPhase = true;

  allTeams: DsbMannschaftDO[] = [];
  unassignedTeams: DsbMannschaftDO[] = [];
  assignedTeams: DsbMannschaftDO[] = [];



  public currentWettkampftyp: WettkampftypDO = new WettkampftypDO();
  public allWettkampftyp: Array<WettkampftypDO> = [new WettkampftypDO()];

  public currentAllDsbMannschaft: Array<DsbMannschaftDO> = [new DsbMannschaftDO()];
  public allDsbMannschaft: Array<DsbMannschaftDO> = [new DsbMannschaftDO()];
  public testMannschaft: DsbMannschaftDO = new DsbMannschaftDO();

  public currentUser: UserProfileDO = new UserProfileDO();
  public allUsers: Array<UserProfileDO> = [new UserProfileDO()];
  public allLigaleiter: Array<UserRolleDO> = [new UserRolleDO()];

  public deleteLoading = false;
  public saveLoading = false;

  public id;

  // For the Mannschaft-Table
  public rows: TableRow[] = [];
  public showTable = false;
  public AlertType = AlertType;
  public showPopup = false;
  public selectedMannschaft: DsbMannschaftDO = new DsbMannschaftDO();
  public currentVerein: VereinDO = new VereinDO();
  public possibleTabellenplatz: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  public oldSortierung: number;

  public currentLigatabelle: Array<LigatabelleErgebnisDO>;

  public ActionButtonColors = ActionButtonColors;


  private sessionHandling: SessionHandling;



  constructor(
    private userDataProviderService: UserDataProviderService,
    private veranstaltungDataProvider: VeranstaltungDataProviderService,
    private wettkampftypDataProvider: WettkampftypDataProviderService,
    private regionProvider: RegionDataProviderService,
    private userProvider: UserProfileDataProviderService,
    private userDataProvider: UserDataProviderService,
    private ligaProvider: LigaDataProviderService,
    private mannschaftDataProvider: DsbMannschaftDataProviderService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private ligatabellenService: LigatabelleDataProviderService,
    private maSortierungService: MannschaftSortierungDataProviderService,
    private matchDataProvider: MatchDataProviderService,
    private currentUserService: CurrentUserService,
    private onOfflineService: OnOfflineService) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);
  }


  ngOnInit() {
    this.loading = true;
    this.loadUnassignedTeams();
    this.notificationService.discardNotification();
    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        this.id = params[ID_PATH_PARAM];

        if (this.id === 'add') {
          this.currentVeranstaltung = new VeranstaltungDO();
          this.currentWettkampftyp = new WettkampftypDO();
          this.currentLiga = new LigaDO();

          this.currentVeranstaltung.groesse = 8;
          this.isPhaseSelectDisabled = true;
          this.loadUsers();
          this.loadLigaleiter();
          this.loadWettkampftyp();
          this.loadLiga();


          this.loading = false;
          this.deleteLoading = false;
          this.saveLoading = false;
        } else {
          this.loadById(params[ID_PATH_PARAM]);
          this.disabledVeranstaltungPhase = false;
          this.showTable = true;
          this.loadMannschaftsTable();
        }
      }
    });
  }

  loadUnassignedTeams(): void {
    // this.mannschaftDataProvider.findAllByVeranstaltungsId(null)
    this.mannschaftDataProvider.findAllByVeranstaltungsId(1001) // ^muss auf die VeranstaltungsId der Warteschlange gesetzt werden
        .then((response: BogenligaResponse<DsbMannschaftDO[]>) => {
          if (response.result === RequestResult.SUCCESS) {
            this.allTeams = response.payload;
            this.unassignedTeams = this.allTeams.filter(team => !this.assignedTeams.includes(team));
          } else {
            console.error('Fehler beim Laden der Mannschaften:', response.result);
          }
        })
        .catch(error => {
          console.error('Verbindungsproblem:', error);
        });
  }

  assignTeamToEvent(team: any): void {
    this.saveLoading = true;
    this.unassignedTeams = this.unassignedTeams.filter(t => t !== team);

    this.selectedMannschaft.id = team.id;
    this.selectedMannschaft.vereinId = team.vereinId;
    this.selectedMannschaft.nummer = team.nummer;
    this.selectedMannschaft.benutzerId = team.benutzerId;
    this.selectedMannschaft.veranstaltungId = this.currentVeranstaltung.id;

    this.mannschaftDataProvider.update(this.selectedMannschaft)
        .then((response: BogenligaResponse<DsbMannschaftDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {

            const id = this.selectedMannschaft.id;

            const notification: Notification = {
              id:          NOTIFICATION_UPDATE_VERANSTALTUNG + id,
              title:       'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_UPDATE_VERANSTALTUNG + id)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.loadMannschaftsTable();
                    this.router.navigateByUrl('/verwaltung/veranstaltung/' + response.payload.veranstaltungId);
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: BogenligaResponse<DsbMitgliedDO>) => {
          console.log('Failed: ' + response);
          const notification: Notification = {
            id:          NOTIFICATION_UPDATE_VERANSTALTUNG_FAILURE,
            title: "MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.UPDATE.FAILURE.FULL.TITLE",
            description: "MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.UPDATE.FAILURE.FULL.DESCRIPTION",
            severity:    NotificationSeverity.ERROR,
            origin:      NotificationOrigin.USER,
            type:        NotificationType.OK,
            userAction:  NotificationUserAction.PENDING

          }
          this.notificationService.observeNotification(NOTIFICATION_UPDATE_VERANSTALTUNG_FAILURE)
              .subscribe((myNotification) => {
                if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                  this.saveLoading = false;
                }
              });

          this.notificationService.showNotification(notification);
          this.saveLoading = false;
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


  public onWettkampftag(ignore: any): void {
    this.navigateToWettkampftage(this.currentVeranstaltung);
  }


  private navigateToWettkampftage(ignore: any) {
    this.router.navigateByUrl('/verwaltung/veranstaltung/' + this.currentVeranstaltung.id + '/' + this.currentVeranstaltung.id);
  }

  // Falls Veranstaltungen erzeugt werden werden die Veranstaltungsattribute gesetzt
  // Anschließend schickt er die Veranstaltung mittels eines Post Request an das Backend
  public onSave(ignore: any): void {
    this.saveLoading = true;

    if (typeof this.currentLiga === 'undefined') {
      this.currentVeranstaltung.ligaId = null;
    } else {
      this.currentVeranstaltung.ligaId = this.currentLiga.id;
      this.currentVeranstaltung.ligaName = this.currentLiga.name;
    }
    if (typeof this.currentUser === 'undefined') {
      this.currentVeranstaltung.ligaleiterId = null;
    } else {
      this.currentVeranstaltung.ligaleiterId = this.currentUser.id;
      this.currentVeranstaltung.ligaleiterEmail = this.currentUser.email;
    }
    if (typeof this.currentWettkampftyp === 'undefined') {
      this.currentVeranstaltung.wettkampfTypId = null;
    } else {
      this.currentVeranstaltung.wettkampfTypId = this.currentWettkampftyp.id;
      this.currentVeranstaltung.wettkampftypName = this.currentWettkampftyp.name;
    }


    // persist
    this.veranstaltungDataProvider.create(this.currentVeranstaltung)
        .then((response: BogenligaResponse<VeranstaltungDO>) => {
            if (!isNullOrUndefined(response)
              && !isNullOrUndefined(response.payload)
              && !isNullOrUndefined(response.payload.id)) {
              console.log('Saved with id: ' + response.payload.id);

              const notification: Notification = {
                id:          NOTIFICATION_SAVE_VERANSTALTUNG,
                title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.SAVE.TITLE',
                description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
                severity:    NotificationSeverity.INFO,
                origin:      NotificationOrigin.USER,
                type:        NotificationType.OK,
                userAction:  NotificationUserAction.PENDING
              };

              this.notificationService.observeNotification(NOTIFICATION_SAVE_VERANSTALTUNG)
                  .subscribe((myNotification) => {
                    if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                      this.saveLoading = false;
                      this.router.navigateByUrl('/verwaltung/veranstaltung/' + response.payload.id);
                    }
                  });

              this.notificationService.showNotification(notification);
            }
          }
        )
        .catch((response) => {
          /*If a Veranstaltung already exists, a notification is created at this point which is displayed on the GUI.
          Ticket BSAPP-686 requires a meaningful text output for the user on this notification which has been implemented.
          Regarding the architecture, this is the right place in the code, because it is responsible for the GUI.  */
          console.log('Veranstaltung existiert bereits in diesem Sportjahr');
          const notification: Notification = {
            id:          NOTIFICATION_SAVE_VERANSTALTUNG_FAILURE,
            title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.SAVE_FAILURE.TITLE',
            description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.SAVE_FAILURE.DESCRIPTION',
            severity:    NotificationSeverity.ERROR,
            origin:      NotificationOrigin.USER,
            type:        NotificationType.OK,
            userAction:  NotificationUserAction.PENDING
          };
          this.notificationService.observeNotification(NOTIFICATION_SAVE_VERANSTALTUNG_FAILURE)
              .subscribe((myNotification) => {
                if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                  this.saveLoading = false;
                }
              });

          this.notificationService.showNotification(notification);

        });
    // show response message
  }


  // Gets executed when button "Mannschaft kopieren" is pressed
  public onCopyMannschaft(ignore: any): void {
    this.saveLoading = true;
    this.veranstaltungDataProvider.findLastVeranstaltungById(this.currentVeranstaltung.id)
        .then((response) => {
            this.lastVeranstaltung = response.payload;
            if (this.lastVeranstaltung.groesse > this.currentVeranstaltung.groesse) {
              this.saveLoading = false;
              console.log('Size of previous Veranstaltung does not equal size of new Veranstaltung');
              const notification: Notification = {
                id:          NOTIFICATION_COPY_MANNSCHAFTEN_FAILURE_SIZEDIFF,
                title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.COPYMANNSCHAFT_FAILURE_SIZEDIFF.TITLE',
                description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.COPYMANNSCHAFT_FAILURE_SIZEDIFF.DESCRIPTION',
                severity:    NotificationSeverity.ERROR,
                origin:      NotificationOrigin.USER,
                type:        NotificationType.OK,
                userAction:  NotificationUserAction.PENDING
              };
              this.notificationService.observeNotification(NOTIFICATION_COPY_MANNSCHAFTEN_FAILURE_SIZEDIFF)
                  .subscribe((myNotification) => {
                    if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                      this.saveLoading = false;
                    }
                  });
              this.notificationService.showNotification(notification);
              return;
            }
            console.log(this.lastVeranstaltung.id);
            console.log('Mannschaften werden kopiert');
            this.mannschaftDataProvider.copyMannschaftFromVeranstaltung(this.lastVeranstaltung.id, this.currentVeranstaltung.id)
                .then((databaseResponse) => this.handleCopyFromVeranstaltungSuccess(databaseResponse)
                  , (databaseResponse: BogenligaResponse<VeranstaltungDO>) => {
                    console.log('Failed');
                    this.saveLoading = false;
                  });
          }
        )
        .catch((response) => {
          console.log('Veranstaltung ist nicht vorhanden');
          const notification: Notification = {
            id:          NOTIFICATION_COPY_MANNSCHAFTEN_FAILURE,
            title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.COPYMANNSCHAFT_FAILURE.TITLE',
            description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.COPYMANNSCHAFT_FAILURE.DESCRIPTION',
            severity:    NotificationSeverity.ERROR,
            origin:      NotificationOrigin.USER,
            type:        NotificationType.OK,
            userAction:  NotificationUserAction.PENDING
          };
          this.notificationService.observeNotification(NOTIFICATION_COPY_MANNSCHAFTEN_FAILURE)
              .subscribe((myNotification) => {
                if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                  this.saveLoading = false;
                }
              });
          this.notificationService.showNotification(notification);
        });
  }

  private createVeranstaltungUpdateNotification(id: number, updateTitle: string, updateDescription: string): Notification {
    const notification: Notification = {
      id:          NOTIFICATION_UPDATE_VERANSTALTUNG_FAILURE + id,
      title:       updateTitle,
      description: updateDescription,
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING};
    return notification;
  }
  public async onUpdate(ignore: any): Promise<void> {
    this.saveLoading = true;
    // set new values for the data persistence
    this.currentVeranstaltung.ligaId = this.currentLiga.id;
    this.currentVeranstaltung.ligaleiterId = this.currentUser.id;
    this.currentVeranstaltung.wettkampfTypId = this.currentWettkampftyp.id;
    const id = this.currentVeranstaltung.id;
    if (this.rows.length > this.currentVeranstaltung.groesse) {
      this.saveLoading = false;
      const notification = this.createVeranstaltungUpdateNotification(id,
        'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.UPDATE_FAILURE.TITLE',
        'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.UPDATE_FAILURE.DESCRIPTION');
      this.notificationService.showNotification(notification);
    }
    // When the user tries to update the phase of the Veranstaltung
    if (this.currentSelectedVeranstaltungPhase !== this.currentVeranstaltung.phase) {
      const response = await this.matchDataProvider.findAllbyVeranstaltungId(id);
      // proper answer of the backend
      if (!isNullOrUndefined(response) && !isNullOrUndefined(response.payload)) {
              // if the veranstaltung has no matches, the select is reset and set to 'Geplant'
              if (response.payload.length === 0 && this.currentSelectedVeranstaltungPhase === 'Laufend') {
                this.currentSelectedVeranstaltungPhase = 'Geplant';
                this.saveLoading = false;
                const notification = this.createVeranstaltungUpdateNotification(id,
                  'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.UPDATE_VERANSTALTUNG_FAILURE.TITLE',
                  'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.UPDATE_VERANSTALTUNG_FAILURE.DESCRIPTION');
                this.notificationService.showNotification(notification);
                return;
                }
      // no proper answer of the backend
      } else {
              this.currentSelectedVeranstaltungPhase = this.currentVeranstaltung.phase;
              this.saveLoading = false;
              const notification = this.createVeranstaltungUpdateNotification(id,
                'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.UPDATE_DATABASE_FAILURE.TITLE',
                'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.UPDATE_DATABASE_FAILURE.DESCRIPTION');
              this.notificationService.showNotification(notification);
              return;
      }
          }
    // persist
    this.currentVeranstaltung.phase = this.currentSelectedVeranstaltungPhase;
    this.veranstaltungDataProvider.update(this.currentVeranstaltung)
        .then((response: BogenligaResponse<VeranstaltungDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            const notification = this.createVeranstaltungUpdateNotification(id,
              'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.UPDATE.TITLE',
              'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.UPDATE.DESCRIPTION');
            this.isPhaseSelectDisabled = true;
            this.notificationService.observeNotification(NOTIFICATION_UPDATE_VERANSTALTUNG + id)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/veranstaltung');
                  }
                });

            this.notificationService.showNotification(notification);
            this.saveLoading = false;
          }
        }, (response: BogenligaResponse<VeranstaltungDO>) => {
          console.log('Failed');
          this.saveLoading = false;
        });
  }


  public onCreatePlatzhalter(ignore: any): void {
    this.saveLoading = true;

    const platzhalterId = 99;
    const platzhalterNummer = '1';


    this.selectedMannschaft.vereinId = platzhalterId;
    this.selectedMannschaft.nummer = platzhalterNummer;
    this.selectedMannschaft.benutzerId = 1;
    this.selectedMannschaft.veranstaltungId = this.currentVeranstaltung.id;

    this.mannschaftDataProvider.create(this.selectedMannschaft, this.currentVerein)
        .then((response: BogenligaResponse<DsbMannschaftDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);
            console.log('Wir sind der Sturm, der über das Ziel hinwegfegt, niemand kann uns aufhalten!');
            const notification: Notification = {
              id:          NOTIFICATION_CREATE_PLATZHALTER,
              title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.PLATZHALTER_SAVE.TITLE',
              description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.PLATZHALTER_SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_CREATE_PLATZHALTER)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.loadMannschaftsTable();
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }
    )
        .catch((response) => {
      const notification: Notification = {
        id:          NOTIFICATION_CREATE_PLATZHALTER_FAILURE,
        title:        'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.PLATZHALTER_FAILURE.TITLE',
        description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.PLATZHALTER_FAILURE.DESCRIPTION',
        severity:    NotificationSeverity.ERROR,
        origin:      NotificationOrigin.USER,
        type:        NotificationType.OK,
        userAction:  NotificationUserAction.PENDING
      };
      this.notificationService.observeNotification(NOTIFICATION_CREATE_PLATZHALTER_FAILURE)
          .subscribe((myNotification) => {
            if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
              this.saveLoading = false;
            }
          });
      this.notificationService.showNotification(notification);
    });
  }

  // This method is called when the abschließen Button is pressed
  public onFinish(ignore: any): void {
    const name = this.currentVeranstaltung.name;
    const id = this.currentVeranstaltung.id;
    const notification: Notification = {
      id:               NOTIFICATION_FINISH_VERANSTALTUNG + id,
      title:            'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.FINISH.TITLE',
      description:      'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.FINISH.DESCRIPTION',
      descriptionParam: '' + name,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };
    // Detect notification
    this.notificationService.observeNotification(NOTIFICATION_FINISH_VERANSTALTUNG + id)
        .subscribe((myNotification) => {
          // If abschließen is confirmed via notifcation update the Veranstaltung
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.currentVeranstaltung.phase = 'Abgeschlossen';
            // persist
            this.veranstaltungDataProvider.update(this.currentVeranstaltung)
                .then((response: BogenligaResponse<VeranstaltungDO>) => {
                  if (!isNullOrUndefined(response)
                    && !isNullOrUndefined(response.payload)
                    && !isNullOrUndefined(response.payload.id)) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/veranstaltung');
                  }
                }, (response: BogenligaResponse<VeranstaltungDO>) => {
                  console.log('Failed');
                  this.saveLoading = false;
                });

          }
        });
    this.notificationService.showNotification(notification);


  }


  public entityExists(): boolean {
    return this.currentVeranstaltung.id >= 0;
  }


  public mannschaftExists(): boolean {
    return this.allDsbMannschaft.filter((veranstaltung) => veranstaltung.id === this.currentVeranstaltung.id).length > 0;
  }


  private loadById(id: number) {
    this.veranstaltungDataProvider.findById(id)
        .then((response: BogenligaResponse<VeranstaltungDO>) => this.handleSuccess(response))
        .catch((response: BogenligaResponse<VeranstaltungDO>) => this.handleFailure(response));
  }


  private loadUsers() {
    this.userProvider.findAll()
        .then((response: BogenligaResponse<UserProfileDO[]>) => this.handleUserResponseArraySuccess(response))
        .catch((response: BogenligaResponse<UserProfileDTO[]>) => this.handleUserResponseArrayFailure(response));
  }


  /**
   *
   * receives a promise including a list of all Ligaleiter
   * @private
   */
  private loadLigaleiter() {
    // Achtung: Diese RollenId ist die des Ligaleiters aus der Datenbank
    // Werden Änderungen in der DB gemacht muss auch hier die ID verändert werden!
    const ligaleiterRolleId = 2;
    this.userDataProvider.findAllUsersByRoleId(ligaleiterRolleId)
        .then((response: BogenligaResponse<UserRolleDO[]>) => this.handleLigaleiterResponseArraySuccess(response))
        .catch((response: BogenligaResponse<UserRolleDTO[]>) => this.handleLigaleiterResponseArrayFailure(response));
  }


  private loadLiga() {
    this.ligaProvider.findAll()
        .then((response: BogenligaResponse<LigaDO[]>) => this.handlLigaResponseArraySuccess(response))
        .catch((response: BogenligaResponse<LigaDTO[]>) => this.handleLigaResponseArrayFailure(response));
  }


  private loadWettkampftyp() {
    this.wettkampftypDataProvider.findAll()
        .then((response: BogenligaResponse<WettkampftypDO[]>) => this.handleWettkampftypResponseArraySuccess(response))
        .catch((response: BogenligaResponse<WettkampftypDTO[]>) => this.handleWettkampftypResponseArrayFailure(response));
  }


  private handleSuccess(response: BogenligaResponse<VeranstaltungDO>) {
    this.currentVeranstaltung = response.payload;
    this.currentSelectedVeranstaltungPhase = this.allVeranstaltungPhases.find((phase) => (phase === this.currentVeranstaltung.phase));
    if (this.currentSelectedVeranstaltungPhase === 'Geplant') {
      this.isPhaseSelectDisabled = false;
    }
    this.loading = false;
    this.loadWettkampftyp();
    this.loadUsers();
    this.loadLigaleiter();
    this.loadLiga();
  }


  private handleFailure(response: BogenligaResponse<VeranstaltungDO>) {
    this.loading = false;
  }


  private handleCopyFromVeranstaltungSuccess(response: BogenligaResponse<void>) {
    this.loadMannschaftsTable();
  }

  private handlLigaResponseArraySuccess(response: BogenligaResponse<LigaDO[]>): void {
    this.allLiga = [];
    const currentUserId = this.currentUserService.getCurrentUserID();
    this.userDataProviderService.findUserRoleById(currentUserId).then((roleresponse: BogenligaResponse<UserRolleDO[]>) => {
      let isAdmin = false;
      if (roleresponse.payload.filter((role) => role.roleName === 'ADMIN').length > 0) {
        isAdmin = true;
      }
      this.allLiga = response.payload.filter((ligaDo) => {
        return ligaDo.ligaUebergeordnetId === currentUserId || ligaDo.ligaVerantwortlichId === currentUserId || isAdmin;
      });
      if (this.id === 'add') {
        this.currentLiga = this.allLiga[0];
      } else {
        this.currentLiga = this.allLiga.filter((liga) => liga.id === this.currentVeranstaltung.ligaId)[0];
      }
    }).catch((err) => console.log(err))
        .finally(() => this.loading = false);
  }


  private handleLigaResponseArrayFailure(response: BogenligaResponse<LigaDTO[]>): void {
    this.allLiga = [];
    this.loading = false;
  }


  private handleWettkampftypResponseArraySuccess(response: BogenligaResponse<WettkampftypDO[]>): void {
    this.allWettkampftyp = [];
    this.allWettkampftyp = response.payload;
    if (this.id === 'add') {
      this.currentWettkampftyp = this.allWettkampftyp[0];
    } else {
      this.currentWettkampftyp = this.allWettkampftyp.filter((wettkampftyp) => wettkampftyp.id === this.currentVeranstaltung.wettkampfTypId)[0];
    }
    this.loading = false;
  }


  private handleWettkampftypResponseArrayFailure(response: BogenligaResponse<WettkampftypDTO[]>): void {
    this.allWettkampftyp = [];
    this.loading = false;
  }


  /**
   * Checks if current Veranstaltung is on Phase 'Laufend'
   * If not button which uses checkVeranstaltungPhase will be greyed out
   */
  public checkVeranstaltungPhase() {
    let laufend = false;
    if (this.currentVeranstaltung.phase === 'Laufend') {
      laufend = true;
    }
    return laufend;
  }


  private handleUserResponseArraySuccess(response: BogenligaResponse<UserProfileDO[]>): void {
    this.allUsers = [];
    this.allUsers = response.payload;
    if (this.id === 'add') {
      this.currentUser = this.allUsers.filter((user) => user.id === this.currentUserService.getCurrentUserID())[0];
    } else {
      this.currentUser = this.allUsers.filter((user) => user.id === this.currentVeranstaltung.ligaleiterId)[0];
    }
    this.loading = false;
  }


  private handleUserResponseArrayFailure(response: BogenligaResponse<UserProfileDTO[]>): void {
    this.allUsers = [];
    this.loading = false;
  }


  private handleLigaleiterResponseArraySuccess(response: BogenligaResponse<UserRolleDTO[]>): void {
    this.allLigaleiter = [];
    this.allLigaleiter = response.payload;

    this.loading = false;
  }


  private handleLigaleiterResponseArrayFailure(response: BogenligaResponse<UserRolleDTO[]>): void {
    this.allLigaleiter = [];
    this.loading = false;
  }


  /**
   * Checks if current Table is empty
   * If not button which uses copyMannschaftFromVeranstaltung will be greyed out
   */
  public checkMannschaftsTableEmpty() {
    let empty = true;
    if (this.rows.length > 0) {
      empty = false;
    }
    return empty;
  }


  private loadMannschaftsTable() {
    this.mannschaftDataProvider.findAllByVeranstaltungsId(this.id)
        .then((response: BogenligaResponse<DsbMannschaftDO[]>) => this.handleLoadMannschaftsTableSuccess(response.payload))
        .catch((response: BogenligaResponse<DsbMannschaftDO[]>) => this.rows = []);
  }


  private handleLoadMannschaftsTableSuccess(payload: DsbMannschaftDO[]) {
    this.rows = toTableRows(payload);
    this.loadLigaTabelleExists();
  }


  public onDeleteMannschaft(versionedDataObject: VersionedDataObject): void {

    this.notificationService.discardNotification();

    const id = versionedDataObject.id;
    this.rows = showDeleteLoadingIndicatorIcon(this.rows, id);

    const notification: Notification = {
      id:               NOTIFICATION_DELETE_MANNSCHAFT + id,
      title:            'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    const notificationEvent = this.notificationService.observeNotification(NOTIFICATION_DELETE_MANNSCHAFT + id)
                                  .subscribe((myNotification) => {

                                    if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                                      this.mannschaftDataProvider.deleteById(id)
                                          .then((response) => this.loadMannschaftsTable())
                                          .catch((response) => this.rows = hideLoadingIndicator(this.rows, id));
                                    } else if (myNotification.userAction === NotificationUserAction.DECLINED) {
                                      this.rows = hideLoadingIndicator(this.rows, id);
                                      notificationEvent.unsubscribe();
                                    }

                                  });

    this.notificationService.showNotification(notification);
  }


  public onEdit(versionedDataObject: VersionedDataObject) {
    this.selectedMannschaft = versionedDataObject as DsbMannschaftDO;

    this.oldSortierung = this.selectedMannschaft.sortierung;
    this.showPopup = true;
  }


  public onTableEditCancel(event: any) {
    this.selectedMannschaft.sortierung = this.oldSortierung;
    this.showPopup = false;
  }


  public onTableEditSave(event: any) {
    const maSortierung = new MannschaftSortierungDO(
      this.selectedMannschaft.id, this.selectedMannschaft.sortierung);
    this.maSortierungService.update(maSortierung)
        .then(() => this.handleTableSaveSuccess())
        .catch(() => this.handleTableSaveFailure());
    this.showPopup = false;
    this.loading = false;
  }


  private handleTableSaveSuccess() {
    const notification: Notification = {
      id:          NOTIFICATION_SAVE_SORTIERUNG,
      title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.TABLE.NOTIFICATION.SAVE.TITLE',
      description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.TABLE.NOTIFICATION.SAVE.DESCRIPTION',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_SAVE_SORTIERUNG)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.saveLoading = false;
            this.loadMannschaftsTable();
          }
        });

    this.notificationService.showNotification(notification);
  }


  private handleTableSaveFailure() {
    console.log('Editing of the Sortierung failed.{}', this.selectedMannschaft);
    this.loadMannschaftsTable();
  }


  public checkForExistingLigatabelle(): boolean {
    return this.currentLigatabelle !== undefined;
  }


  private loadLigaTabelleExists() {
    this.ligatabellenService.getLigatabelleVeranstaltung(this.id)
        .then((response: BogenligaResponse<LigatabelleErgebnisDO[]>) => response.payload.length >= 4 ? this.handleLigatabelleExistsSuccess(response) : this.handleLigatabelleExistsFailure())
        .catch(() => this.handleLigatabelleExistsFailure());
  }


  private handleLigatabelleExistsFailure() {
    console.log('Initiale Ligatabelle does not yet exist');
    this.currentLigatabelle = undefined;
    this.saveLoading = false;
  }


  private handleLigatabelleExistsSuccess(response: BogenligaResponse<LigatabelleErgebnisDO[]>) {
    try {
      this.currentLigatabelle = response.payload;
      for (const row of this.rows) {
        row.disabledActions.push(TableActionType.EDIT);
        row.hiddenActions.push(TableActionType.EDIT);
      }
      this.saveLoading = false;
    } catch (error) {
      console.error(error);
    }
  }



  // Creates Initial Matches for a Veranstaltung
  public createMatchesWT0(event: any) {

    this.saveLoading = true;

    this.matchDataProvider.createInitialMatchesWT0(this.currentVeranstaltung)
        .then(() => {
          this.handleCreateMatchesWT0Success();
        })
        .catch(() => this.handleCreateMatchesWT0Failure());
  }


  private handleCreateMatchesWT0Success() {
    const notification: Notification = {
      id:          NOTIFICATION_INIT_LIGATABELLE_SUC,
      title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.TABLE.NOTIFICATION.MATCHES.SUC.TITLE',
      description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.TABLE.NOTIFICATION.MATCHES.SUC.DESCRIPTION',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_INIT_LIGATABELLE_SUC)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.saveLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
    this.loadLigaTabelleExists();
  }


  private handleCreateMatchesWT0Failure() {
    const notification: Notification = {
      id:          NOTIFICATION_INIT_LIGATABELLE_FAIL,
      title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.TABLE.NOTIFICATION.MATCHES.FAILURE.TITLE',
      description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.TABLE.NOTIFICATION.MATCHES.FAILURE.DESCRIPTION',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_INIT_LIGATABELLE_FAIL)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.saveLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  public hasCurrentUserAdminPermissions(): boolean {
    return this.currentUserService.hasPermission(UserPermission.CAN_CREATE_SYSTEMDATEN);
  }

}
