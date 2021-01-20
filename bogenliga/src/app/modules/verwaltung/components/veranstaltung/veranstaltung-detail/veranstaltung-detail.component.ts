import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AlertType, ButtonType, CommonComponentDirective, toTableRows} from '@shared/components';
import {BogenligaResponse} from '@shared/data-provider';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';
import {UserProfileDataProviderService} from '../../../../user/services/user-profile-data-provider.service';
import {UserProfileDTO} from '../../../../user/types/model/user-profile-dto.class';
import {UserProfileDO} from '../../../../user/types/user-profile-do.class';
import {VeranstaltungDataProviderService} from '../../../services/veranstaltung-data-provider.service';
import {RegionDataProviderService} from '../../../services/region-data-provider.service';
import {VeranstaltungDTO} from '../../../types/datatransfer/veranstaltung-dto.class';
import {VeranstaltungDO} from '../../../types/veranstaltung-do.class';
import {VERANSTALTUNG_DETAIL_CONFIG, VERANSTALTUNG_DETAIL_TABLE_Config} from './veranstaltung-detail.config';
import {LigaDataProviderService} from '../../../services/liga-data-provider.service';
import {LigaDO} from '../../../../verwaltung/types/liga-do.class';
import {LigaDTO} from '../../../../verwaltung/types/datatransfer/liga-dto.class';
import {WettkampftypDataProviderService} from '../../../services/wettkampftyp-data-provider.service';
import {WettkampftypDO} from '../../../../verwaltung/types/wettkampftyp-do.class';
import {WettkampftypDTO} from '../../../../verwaltung/types/datatransfer/wettkampftyp-dto.class';
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';
import {DsbMannschaftDTO} from '@verwaltung/types/datatransfer/dsb-mannschaft-dto.class';
import {DsbMannschaftDataProviderService} from '../../../services/dsb-mannschaft-data-provider.service';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {WettkampfDataProviderService} from '../../../../wettkampf/services/wettkampf-data-provider.service';
import {LigatabelleErgebnisDO} from '../../../../wettkampf/types/wettkampf-ergebnis-do.class';
import {MannschaftSortierungDataProviderService} from '@verwaltung/services/mannschaftSortierung-data-provider.service';
import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';
import {MannschaftSortierungDO} from '@verwaltung/types/mannschaftSortierung-do.class';
import {MatchDataProviderService} from '@verwaltung/services/match-data-provider.service';

const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_VERANSTALTUNG = 'veranstaltung_detail_delete';
const NOTIFICATION_DELETE_VERANSTALTUNG_SUCCESS = 'veranstaltung_detail_delete_success';
const NOTIFICATION_DELETE_VERANSTALTUNG_FAILURE = 'veranstaltung_detail_delete_failure';
const NOTIFICATION_SAVE_VERANSTALTUNG = 'veranstaltung_detail_save';
const NOTIFICATION_UPDATE_VERANSTALTUNG = 'veranstaltung_detail_update';
const NOTIFICATION_SAVE_SORTIERUNG = 'veranstaltung_detail_save_sortierung';
const NOTIFICATION_INIT_LIGATABELLE_SUC = 'init_Ligatabelle_suc';
const NOTIFICATION_INIT_LIGATABELLE_FAIL = 'init_Ligatabelle_fail';


@Component({
  selector:    'bla-veranstaltung-detail',
  templateUrl: './veranstaltung-detail.component.html',
  styleUrls:   ['./veranstaltung-detail.component.scss']
})
export class VeranstaltungDetailComponent extends CommonComponentDirective implements OnInit {
  public config = VERANSTALTUNG_DETAIL_CONFIG;
  public tableConfig = VERANSTALTUNG_DETAIL_TABLE_Config;
  public ButtonType = ButtonType;

  public currentVeranstaltung: VeranstaltungDO = new VeranstaltungDO();
  public allVeranstaltung: Array<VeranstaltungDO> = [new VeranstaltungDO()];
  public lastVeranstaltung: VeranstaltungDO = new VeranstaltungDO();


  public currentLiga: LigaDO = new LigaDO();
  public allLiga: Array<LigaDO> = [new LigaDO()];

  public currentWettkampftyp: WettkampftypDO = new WettkampftypDO();
  public allWettkampftyp: Array<WettkampftypDO> = [new WettkampftypDO()];

  public currentAllDsbMannschaft: Array<DsbMannschaftDO> = [new DsbMannschaftDO()];
  public allDsbMannschaft: Array<DsbMannschaftDO> = [new DsbMannschaftDO()];
  public testMannschaft: DsbMannschaftDO = new DsbMannschaftDO();



  public currentUser: UserProfileDO = new UserProfileDO();
  public allUsers: Array<UserProfileDO> = [new UserProfileDO()];


  public deleteLoading = false;
  public saveLoading = false;

  public id;

  // For the Mannschaft-Table
  public rows: TableRow[];
  public showTable = false;
  public AlertType = AlertType;
  public showPopup = false;
  public selectedMannschaft: DsbMannschaftDO = new DsbMannschaftDO();
  public possibleTabellenplatz: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
  public oldSortierung: number;

  constructor(
    private veranstaltungDataProvider: VeranstaltungDataProviderService,
    private wettkampftypDataProvider: WettkampftypDataProviderService,
    private regionProvider: RegionDataProviderService,
    private userProvider: UserProfileDataProviderService,
    private ligaProvider: LigaDataProviderService,
    private mannschaftDataProvider: DsbMannschaftDataProviderService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private ligatabellenService: WettkampfDataProviderService,
    private maSortierungService: MannschaftSortierungDataProviderService,
    private matchDataProvider: MatchDataProviderService) {
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
          this.currentWettkampftyp = new WettkampftypDO();
          this.currentLiga = new LigaDO();


          this.loadUsers();
          this.loadWettkampftyp();
          this.loadLiga();


          this.loading = false;
          this.deleteLoading = false;
          this.saveLoading = false;
        } else {
          this.loadById(params[ID_PATH_PARAM]);
          this.showTable = true;
          this.loadMannschaftsTable();
        }
      }
    });
  }

  public onWettkampftag(ignore: any): void {
    this.navigateToWettkampftage(this.currentVeranstaltung);
  }

  private navigateToWettkampftage(ignore: any) {
    this.router.navigateByUrl('/verwaltung/veranstaltung/' + this.currentVeranstaltung.id + '/' + this.currentVeranstaltung.id);
  }

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
        }, (response: BogenligaResponse<VeranstaltungDO>) => {
          console.log('Failed');
          this.saveLoading = false;


        });


    // show response message
  }
  public onCopyMannschaft(ignore: any): void {
    this.loadDsbMannschaft();
    if (typeof this.lastVeranstaltung != null) {
      this.saveLoading = true;
      if (this.allDsbMannschaft.length > 0) {

      for (let i = 0; i <= this.allDsbMannschaft.length; i++) {

        this.testMannschaft.veranstaltungId = this.currentVeranstaltung.id;
        this.testMannschaft.veranstaltungName = this.currentVeranstaltung.name;
        this.testMannschaft.benutzerId = this.allDsbMannschaft[i].benutzerId;
        this.testMannschaft.vereinId = this.allDsbMannschaft[i].vereinId;
        this.testMannschaft.nummer = this.allDsbMannschaft[i].nummer;
        this.testMannschaft.name = this.allDsbMannschaft[i].name;
        // persist

        this.mannschaftDataProvider.create(this.testMannschaft, null)
            .then((response: BogenligaResponse<DsbMannschaftDO>) => {
              if (!isNullOrUndefined(response)
                && !isNullOrUndefined(response.payload)
                && !isNullOrUndefined(response.payload.id)) {
                console.log('Saved with id: ' + response.payload.id);

                const notification: Notification = {
                  id:          NOTIFICATION_SAVE_VERANSTALTUNG,
                  title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.SAVEMANNSCHAFT.TITLE',
                  description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.SAVEMANNSCHAFT.DESCRIPTION',
                  severity:    NotificationSeverity.INFO,
                  origin:      NotificationOrigin.USER,
                  type:        NotificationType.OK,
                  userAction:  NotificationUserAction.PENDING
                };

                this.notificationService.observeNotification(NOTIFICATION_SAVE_VERANSTALTUNG)
                    .subscribe((myNotification) => {
                      if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                        this.saveLoading = false;
                        this.router.navigateByUrl('/verwaltung/');
                      }
                    });

                this.notificationService.showNotification(notification);
              }
            }, (response: BogenligaResponse<VeranstaltungDO>) => {
              console.log('Failed');
              this.saveLoading = false;


            });

      }} else {
        console.log('Keine Mannschaften verfügbar');
        this.saveLoading = false;
      }
    } else {
      console.log('Veranstaltung ist nicht vorhanden');
    }
    // show response message
  }



  public onUpdate(ignore: any): void {
    this.saveLoading = true;
    this.currentVeranstaltung.ligaId = this.currentLiga.id;
    this.currentVeranstaltung.ligaleiterId = this.currentUser.id;
    this.currentVeranstaltung.wettkampfTypId = this.currentWettkampftyp.id;

    // persist
    this.veranstaltungDataProvider.update(this.currentVeranstaltung)
        .then((response: BogenligaResponse<VeranstaltungDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {

            const id = this.currentVeranstaltung.id;

            const notification: Notification = {
              id:          NOTIFICATION_UPDATE_VERANSTALTUNG + id,
              title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.UPDATE.TITLE',
              description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.UPDATE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

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

  /**
   * Deletes all Wettkampftag entries of the provided VeranstaltungID
   */


  public onDelete(ignore: any): void {
    this.deleteLoading = true;
    this.notificationService.discardNotification();

    const id = this.currentVeranstaltung.id;


    const notification: Notification = {
      id:               NOTIFICATION_DELETE_VERANSTALTUNG + id,
      title:            'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_VERANSTALTUNG + id)
        .subscribe((myNotification) => {

          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.veranstaltungDataProvider.deleteById(id)
                .then((response) => this.handleDeleteSuccess(response))
                .catch((response) => this.handleDeleteFailure(response));
          } else if (myNotification.userAction === NotificationUserAction.DECLINED) {
            this.deleteLoading = false;
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

  private loadDsbMannschaft() {
    this.mannschaftDataProvider.findAll()
        .then((response: BogenligaResponse<DsbMannschaftDO[]>) => this.handleDsbMannschaftResponseArraySuccess(response))
        .catch((response: BogenligaResponse<DsbMannschaftDTO[]>) => this.handleDsbMannschaftResponseArrayFailure(response));

  }

  private loadAllVeranstaltung() {
    this.veranstaltungDataProvider.findAll()
        .then((response: BogenligaResponse<VeranstaltungDO[]>) => this.handleAllVeranstaltungResponseArraySuccess(response))
        .catch((response: BogenligaResponse<VeranstaltungDTO[]>) => this.handleAllVeranstaltungResponseArrayFailure(response));

  }


  private handleSuccess(response: BogenligaResponse<VeranstaltungDO>) {
    this.currentVeranstaltung = response.payload;
    this.loading = false;
    this.loadWettkampftyp();
    this.loadUsers();
    this.loadLiga();
    this.loadAllVeranstaltung();




  }

  private handleFailure(response: BogenligaResponse<VeranstaltungDO>) {
    this.loading = false;

  }

  private handleDeleteSuccess(response: BogenligaResponse<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_VERANSTALTUNG_SUCCESS,
      title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.DELETE_SUCCESS.TITLE',
      description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.DELETE_SUCCESS.DESCRIPTION',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_VERANSTALTUNG_SUCCESS)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.router.navigateByUrl('/verwaltung/veranstaltung');
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleDeleteFailure(response: BogenligaResponse<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_VERANSTALTUNG_FAILURE,
      title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.DELETE_FAILURE.TITLE',
      description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.DELETE_FAILURE.DESCRIPTION',
      severity:    NotificationSeverity.ERROR,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_VERANSTALTUNG_FAILURE)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handlLigaResponseArraySuccess(response: BogenligaResponse<LigaDO[]>): void {
    this.allLiga = [];
    this.allLiga = response.payload;
    if (this.id === 'add') {
      this.currentLiga = this.allLiga[0];
    } else {
      this.currentLiga = this.allLiga.filter((liga) => liga.id === this.currentVeranstaltung.ligaId)[0];
    }
    this.loading = false;
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

  private handleUserResponseArraySuccess(response: BogenligaResponse<UserProfileDO[]>): void {
    this.allUsers = [];
    this.allUsers = response.payload;
    if (this.id === 'add') {
      this.currentUser = this.allUsers[0];
    } else {
      this.currentUser = this.allUsers.filter((user) => user.id === this.currentVeranstaltung.ligaleiterId)[0];
    }
    this.loading = false;
  }

  private handleUserResponseArrayFailure(response: BogenligaResponse<UserProfileDTO[]>): void {
    this.allUsers = [];
    this.loading = false;
  }

  private handleDsbMannschaftResponseArraySuccess(response: BogenligaResponse<DsbMannschaftDO[]>): void {
    this.allDsbMannschaft = [];
    this.allDsbMannschaft = response.payload;


    this.allVeranstaltung = this.allVeranstaltung.filter((liga) => liga.ligaId === this.currentVeranstaltung.ligaId);
    this.allVeranstaltung = this.allVeranstaltung.filter((sportjahr) => sportjahr.sportjahr === this.currentVeranstaltung.sportjahr - 1);
    this.allVeranstaltung = this.allVeranstaltung.filter((wettkamptyp) => wettkamptyp.wettkampfTypId === this.currentVeranstaltung.wettkampfTypId);
    // this.allVeranstaltung = this.allVeranstaltung.filter((name) => name.name === this.currentVeranstaltung.name);
    this.lastVeranstaltung = this.allVeranstaltung[0];

    console.log('This AlL DsbManschaften ' + this.allDsbMannschaft.length);
    this.allDsbMannschaft = this.allDsbMannschaft.filter((veranstaltung) => veranstaltung.veranstaltungId === this.lastVeranstaltung.id);
    console.log('This AlL DsbManschaften unten ' + this.allDsbMannschaft.length);
    this.loading = false;
  }

  private handleDsbMannschaftResponseArrayFailure(response: BogenligaResponse<DsbMannschaftDTO[]>): void {
    this.allDsbMannschaft = [];
    this.loading = false;
    console.log('Fehler :DSB Mannschaft konnte nicht abgerufen werden.');
  }

  private handleAllVeranstaltungResponseArraySuccess(response: BogenligaResponse<VeranstaltungDO[]>): void {
    this.allVeranstaltung = [];
    this.allVeranstaltung = response.payload;

    this.loading = false;
    this.loadDsbMannschaft();
  }

  private handleAllVeranstaltungResponseArrayFailure(response: BogenligaResponse<VeranstaltungDTO[]>): void {
    this.allVeranstaltung = [];
    this.loading = false;
  }


  private loadMannschaftsTable() {
    this.mannschaftDataProvider.findAllByVeranstaltungsId(this.id)
      .then((response: BogenligaResponse<DsbMannschaftDO[]>) => this.loadTableRows(response.payload))
      .catch((response: BogenligaResponse<DsbMannschaftDO[]>) => this.rows = []);
      // this.ligatabellenService.getLigatabelleVeranstaltung(this.id)
      //   .then((response: BogenligaResponse<LigatabelleErgebnisDO[]>) => this.loadTableRows(response.payload))
      //   .catch((response: BogenligaResponse<LigatabelleErgebnisDO[]>) => this.rows = []);
  }

  private loadTableRows(payload: DsbMannschaftDO[]) {
    this.rows = toTableRows(payload);
  }

  public onEdit(versionedDataObject: VersionedDataObject) {
    this.selectedMannschaft = versionedDataObject as DsbMannschaftDO;

    this.oldSortierung = this.selectedMannschaft.sortierung;
    this.showPopup = true;
  }

  public onTableEditCancel( event: any) {
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

  public checkCountMannschaften(): boolean {
    return !(this.rows !== undefined && this.rows.length === 8);
  }

  public createMatchesWT0(event: any) {
    this.matchDataProvider.createInitialMatchesWT0(this.currentVeranstaltung)
      .then(() => this.handleCreateMatchesWT0Success())
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
}
