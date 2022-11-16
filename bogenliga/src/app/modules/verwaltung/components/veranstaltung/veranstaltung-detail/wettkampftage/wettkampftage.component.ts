import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ButtonType, CommonComponentDirective} from '@shared/components';
import {BogenligaResponse} from '@shared/data-provider';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../../shared/services/notification';
import {UserProfileDataProviderService} from '@user/services/user-profile-data-provider.service';
import {UserProfileDTO} from '@user/types/model/user-profile-dto.class';
import {UserProfileDO} from '@user/types/user-profile-do.class';
import {VeranstaltungDataProviderService} from '../../../../services/veranstaltung-data-provider.service';
import {VeranstaltungDO} from '../../../../types/veranstaltung-do.class';
import {WETTKAMPFTAGE_CONFIG} from './wettkampftage.config';
import {WettkampfDO} from '@verwaltung/types/wettkampf-do.class';
import {WettkampfDTO} from '@verwaltung/types/datatransfer/wettkampf-dto.class';
import {WettkampfDataProviderService} from '../../../../services/wettkampf-data-provider.service';
import {UserRolleDO} from '@verwaltung/types/user-rolle-do.class';
import {UserRolleDTO} from '@verwaltung/types/datatransfer/user-rolle-dto.class';
import {UserDataProviderService} from '../../../../services/user-data-provider.service';
import {KampfrichterDO} from '@verwaltung/types/kampfrichter-do.class';
import {KampfrichterProviderService} from '../../../../services/kampfrichter-data-provider.service';
import {LizenzDO} from '@verwaltung/types/lizenz-do.class';
import {DsbMitgliedDO} from '@verwaltung/types/dsb-mitglied-do.class';
import {DsbMitgliedDataProviderService} from '@verwaltung/services/dsb-mitglied-data-provider.service';
import {LizenzDataProviderService} from '@verwaltung/services/lizenz-data-provider.service';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {EinstellungenProviderService} from '@verwaltung/services/einstellungen-data-provider.service';
import {EinstellungenDO} from '@verwaltung/types/einstellungen-do.class';
import {KampfrichterExtendedDO} from '@verwaltung/types/kampfrichter-extended-do.class';
import {TranslatePipe} from '@ngx-translate/core';
import {SessionHandling} from '@shared/event-handling';
import {CurrentUserService} from '@shared/services';

const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_WETTKAMPFTAG = 'wettkampftag_delete';
const NOTIFICATION_DELETE_WETTKAMPFTAG_SUCCESS = 'wettkampftag_delete_success';
const NOTIFICATION_DELETE_WETTKAMPFTAG_FAILURE = 'wettkampftag_delete_failure';
const NOTIFICATION_SAVE_VERANSTALTUNG = 'veranstaltung_detail_save';
const NOTIFICATION_WETTKAMPFTAG_TOO_MANY = 'veranstaltung_detail_wettkampftage_failure';

const wettkampfTagNotification: Notification = {
  id:          NOTIFICATION_SAVE_VERANSTALTUNG,
  title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG.NOTIFICATION.SAVE.TITLE',
  description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG.NOTIFICATION.SAVE.DESCRIPTION',
  severity:    NotificationSeverity.INFO,
  origin:      NotificationOrigin.USER,
  type:        NotificationType.OK,
  userAction:  NotificationUserAction.PENDING
};

// TODO: die Variable valid zur Steuerung disabled (SaveButton) ist global, ohne Funktion und unterscheidet nicht den
// Status der Eingabefelder

@Component({
  selector:    'bla-wettkampftage',
  templateUrl: './wettkampftage.component.html',
  styleUrls:   ['./wettkampftage.component.scss'],
  providers: [TranslatePipe]
})

export class WettkampftageComponent extends CommonComponentDirective implements OnInit {
  @Input() public kampfrichterLeftCaptionTranslationKey = 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.KAMPFRICHTERLISTE.LEFTCAPTION';
  @Input() public kampfrichterRightCaptionTranslationKey = 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.KAMPFRICHTERLISTE.RIGHTCAPTION';

  public config = WETTKAMPFTAGE_CONFIG;
  public ButtonType = ButtonType;

  public currentVeranstaltung: VeranstaltungDO = new VeranstaltungDO();
  public currentUser: UserProfileDO;
  public rows: TableRow[];

  public currentWettkampftag: WettkampfDO = new WettkampfDO();
  public currentWettkampftagArray: Array<WettkampfDO> = [];
  public allWettkampf: Array<WettkampfDO> = [];
  public currentAusrichter: Array<UserProfileDO> = [];
  public allUsers: Array<UserProfileDO> = [new UserProfileDO()];

  public deleteLoading = false;
  public saveLoading = false;
  public id;

  public allKampfrichterLizenzen: Array<LizenzDO> = [];
  public allDsbMitgliederWithKampfrichterLizenz: Array<DsbMitgliedDO> = [];
  public allUserWithKampfrichterLizenz: Array<UserRolleDO> = [];

  public notSelectedKampfrichter: Array<Array<KampfrichterExtendedDO>> = [];
  public selectedKampfrichter: Array<Array<KampfrichterExtendedDO>> = [];

  public selectedKampfrichterBeforeSave: Array<Array<KampfrichterExtendedDO>> = [];
  public notSelectedKampfrichterBeforeSave: Array<Array<KampfrichterExtendedDO>> = [];

  text = '. Wettkampftag';

  public selectedDTOs: WettkampfDO[];
  public loadingWettkampf = true;
  public selectedWettkampfTag = 1;
  public anzahl = 0;
  public maxWettkampftageEinstellungenDO: EinstellungenDO = new EinstellungenDO();
  public maxWettkampftageID = 8;
  public selectedWettkampf: WettkampfDO;

  private sessionHandling: SessionHandling;

  constructor(
    private veranstaltungDataProvider: VeranstaltungDataProviderService,
    private wettkampfDataProvider: WettkampfDataProviderService,
    private userProvider: UserProfileDataProviderService,
    private lizenzProvider: LizenzDataProviderService,
    private dsbMitgliedProvider: DsbMitgliedDataProviderService,
    private userRolleProvider: UserDataProviderService,
    private kampfrichterProvider: KampfrichterProviderService,
    private router: Router,
    private route: ActivatedRoute,
    private einstellungenProvider: EinstellungenProviderService,
    private notificationService: NotificationService,
    private translate: TranslatePipe,
    private currentUserService: CurrentUserService) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService);
  }

  ngOnInit() {
    // Arrays needs to be filled:
    this.currentWettkampftagArray.push(new WettkampfDO());
    this.currentAusrichter.push(new UserProfileDO());
    this.currentWettkampftagArray.push(new WettkampfDO());
    this.currentAusrichter.push(new UserProfileDO());

    // loading configuration parameter od maxWettkampftageID
    this.loadConfigParam(this.maxWettkampftageID);

    this.loading = true;
    this.notificationService.discardNotification();
    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        this.id = params[ID_PATH_PARAM];
        if (this.id === 'add') {
          this.currentVeranstaltung = new VeranstaltungDO();
          this.loading = false;
          this.deleteLoading = false;
          this.saveLoading = false;
        } else {
          this.loadById(params[ID_PATH_PARAM]);
          // this.loadUsers();   // This should only execute, when loadById has already finished!
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

  public onVeranstaltungDetail(ignore: any): void {
    this.navigateToWettkampftage(this.currentVeranstaltung);
  }

  private loadUsers() {
    this.userProvider.findAll()
        .then((response: BogenligaResponse<UserProfileDO[]>) => this.handleUserResponseArraySuccess(response))
        .catch((response: BogenligaResponse<UserProfileDTO[]>) => this.handleUserResponseArrayFailure(response));
  }

  private handleUserResponseArraySuccess(response: BogenligaResponse<UserProfileDO[]>): void {
    console.log('==> HandleUserResponseArraySuccess');
    this.allUsers = [];
    this.allUsers = response.payload;

    for (let i = 1; i <= this.allUsers.length; i++) {
      this.currentAusrichter[i] = this.allUsers.filter((user) => user.id === this.currentWettkampftagArray[this.selectedWettkampfTag].wettkampfAusrichter)[0] ?? this.allUsers[0];
    }
    this.loading = false;
  }

  private handleUserResponseArrayFailure(response: BogenligaResponse<UserProfileDTO[]>): void {
    this.allUsers = [];
    this.loading = false;
  }

  private navigateToWettkampftage(ignore: any) {
    this.router.navigateByUrl('/verwaltung/veranstaltung/' + this.currentVeranstaltung.id);
  }

  public onSaveWettkampfTag(wettkampfTagNumber: number, ignore: any): void {
    this.saveWettkaempfe(wettkampfTagNumber).then((wettkampfID) => this.updateKampfrichter(wettkampfTagNumber, wettkampfID));
  }

  public async saveWettkaempfe(wettkampfTagNumber: number): Promise<number> {
    this.anzahl++;

    let currentWettkampfTag: WettkampfDO;
    let currentAusrichter: UserProfileDO;

    this.loadWettkampf();
    this.currentWettkampftagArray.forEach((element) => {if (element.wettkampfTag == wettkampfTagNumber) {currentWettkampfTag = element; }});

    currentWettkampfTag = this.currentWettkampftagArray[wettkampfTagNumber];
    currentAusrichter = this.currentAusrichter[wettkampfTagNumber];
    currentWettkampfTag.wettkampfTag = wettkampfTagNumber;
    currentWettkampfTag.wettkampfVeranstaltungsId = this.currentVeranstaltung.id;
    currentWettkampfTag.wettkampfDisziplinId = 0;
    currentWettkampfTag.wettkampfTypId = this.currentVeranstaltung.wettkampfTypId;
    currentWettkampfTag.wettkampfAusrichter = currentAusrichter.id;

    if (currentWettkampfTag.id == null) {
      // die Daten sind initial angelegt - es exitsiert noch keine ID --> Save nicht update
      const wettkampfID: number = await this.saveWettkampftag(currentWettkampfTag);
      currentWettkampfTag.id = wettkampfID;
      return wettkampfID;
    } else {
      this.updateWettkampftag(currentWettkampfTag);
    }
    return currentWettkampfTag.id;
  }

  // Method adds new Wettkampftag -> called by "+Neu"-Button
  public async onAddWettkampfTag(ignore: any): Promise<void> {
    this.currentWettkampftagArray.push(new WettkampfDO());
    this.loadDistinctWettkampf();
    await this.createInitWettkampfTag((this.anzahl) + 1);
    this.loadDistinctWettkampf();
  }

  // Method copys current Wettkampftag -> called by "Kopieren"-Button
  public async onCopyWettkampfTag(ignore: any): Promise<void> {
    this.currentWettkampftagArray.push(new WettkampfDO());
    this.loadDistinctWettkampf();
    await this.copyCurrentWettkampfTag((this.anzahl) + 1);
    this.loadDistinctWettkampf();
  }

  public updateKampfrichter(wettkampfTagNumber: number, wettkampfID: number): void {

    let kampfrichterExtendedToSave: Array<KampfrichterExtendedDO> = [];
    let kampfrichterExtendedToDelete: Array<KampfrichterExtendedDO> = [];


    kampfrichterExtendedToSave = this.selectedKampfrichter[wettkampfTagNumber].filter(comparer(this.selectedKampfrichterBeforeSave[wettkampfTagNumber]));
    kampfrichterExtendedToDelete = this.notSelectedKampfrichter[wettkampfTagNumber].filter(comparer(this.notSelectedKampfrichterBeforeSave[wettkampfTagNumber]));


    // EXTENDED -> REGULAR DO
    const kampfrichterToSave: Array<KampfrichterDO> = [];
    for (const i of Object.keys(kampfrichterExtendedToSave)) {
      kampfrichterToSave.push(new KampfrichterDO());
      kampfrichterToSave[i].id = kampfrichterExtendedToSave[i].id;
      kampfrichterToSave[i].wettkampfID = wettkampfID;
      kampfrichterToSave[i].leitend = false;
    }

    const kampfrichterToDelete: Array<KampfrichterDO> = [];
    for (const i of Object.keys(kampfrichterExtendedToDelete)) {
      kampfrichterToDelete.push(new KampfrichterDO());
      kampfrichterToDelete[i].id = kampfrichterExtendedToDelete[i].id;
      kampfrichterToDelete[i].wettkampfID = wettkampfID;
      kampfrichterToDelete[i].leitend = false;
    }


    if (kampfrichterToSave.length > 0) {
      console.log(kampfrichterToSave.length);
      this.saveKampfrichterArray(kampfrichterToSave);
    }

    if (kampfrichterToDelete.length > 0) {
      console.log(kampfrichterToDelete.length);
      this.deleteKampfrichterArray(kampfrichterToDelete);
    }

    function comparer(otherArray) {
      return (current) => otherArray.filter((other) => {
        return JSON.stringify(other) === JSON.stringify(current); // && other.display == current.display
      }).length === 0;

    }
  }

  private wettkampftagService() {
    this.notificationService.observeNotification(NOTIFICATION_SAVE_VERANSTALTUNG)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.saveLoading = false;
            this.router.navigateByUrl('/verwaltung/veranstaltung/' + this.currentVeranstaltung.id + '/' +
              this.currentVeranstaltung.id);
          }
        });
  }

  private saveWettkampftag(wettkampfDO: WettkampfDO): Promise<number> {
    return this.wettkampfDataProvider.create(wettkampfDO)
               .then((response: BogenligaResponse<WettkampfDTO>) => {
                 if (!isNullOrUndefined(response)
                   && !isNullOrUndefined(response.payload)
                   && !isNullOrUndefined(response.payload.id)) {
                   console.log('Saved with id: ' + response.payload.id);

                   wettkampfDO.id = response.payload.id;
                   console.log(wettkampfDO);

                   this.wettkampftagService();

                 }
                 return response.payload.id;
               }, (response: BogenligaResponse<WettkampfDO>) => {
                 console.log('Failed');
                 this.saveLoading = false;
                 return null;
               });
  } // end save wettkampftag

  private updateWettkampftag(wettkampfDO: WettkampfDO): void {
    console.log('==> updateWettkampf');
    console.log(wettkampfDO);
    this.wettkampfDataProvider.update(wettkampfDO)
        .then((response: BogenligaResponse<WettkampfDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            const notification: Notification = {
              id:          NOTIFICATION_SAVE_VERANSTALTUNG,
              title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG.NOTIFICATION.UPDATE.TITLE',
              description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG.NOTIFICATION.UPDATE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.wettkampftagService();
            this.notificationService.showNotification(notification);
          }
        }, (response: BogenligaResponse<WettkampfDO>) => {
          console.log('Failed');
          this.saveLoading = false;
        });
  }

  private saveKampfrichterArray(kampfrichterArray: Array<KampfrichterDO>): void {
    for (const iter of Object.keys(kampfrichterArray)) {
      // TODO: Fix the provider so that it doesn't send the data to the liga API
      this.kampfrichterProvider.create(kampfrichterArray[iter])
          .then((response: BogenligaResponse<KampfrichterDO>) => {
            if (!isNullOrUndefined(response)
              && !isNullOrUndefined(response.payload)
              && !isNullOrUndefined(response.payload.id)) {
              console.log('Saved with id: ' + response.payload.id);

              // TODO: Put this code in it's own method
              const notification: Notification = {
                id:          NOTIFICATION_SAVE_VERANSTALTUNG,
                title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG.NOTIFICATION.SAVE.TITLE',
                description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG.NOTIFICATION.SAVE.DESCRIPTION',
                severity:    NotificationSeverity.INFO,
                origin:      NotificationOrigin.USER,
                type:        NotificationType.OK,
                userAction:  NotificationUserAction.PENDING
              };

              this.notificationService.observeNotification(NOTIFICATION_SAVE_VERANSTALTUNG)
                  .subscribe((myNotification) => {
                    if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                      this.saveLoading = false;
                      this.router.navigateByUrl('/verwaltung/veranstaltung/' + this.currentVeranstaltung.id + '/' + this.currentVeranstaltung.id);
                    }
                  });

              this.notificationService.showNotification(notification);
            }
          }, (response: BogenligaResponse<KampfrichterDO>) => {
            console.log('Failed');
            this.saveLoading = false;
          });
    }
  }

  private deleteKampfrichterArray(kampfrichterArray: Array<KampfrichterDO>): void {
    for (const iter of Object.keys(kampfrichterArray)) {
      this.kampfrichterProvider.delete(kampfrichterArray[iter].id, kampfrichterArray[iter].wettkampfID)
          .then((response: BogenligaResponse<void>) => {
            console.log('Successfully deleted');
            this.wettkampftagService();
            this.notificationService.showNotification(wettkampfTagNotification);
          }, (response:
            BogenligaResponse<void>) => {
            console.log('Failed');
            this.saveLoading = false;
          });
    }
  }

  // method that deletes a wettkampftag if the deadline of the veranstaltung has not expired
  public onDelete(wettkampfTagNumber: number, ignore: any): void {
    this.deleteLoading = true;
    this.notificationService.discardNotification();

    const id = this.currentWettkampftagArray[wettkampfTagNumber].id;
    this.updateNumbersDelete();

    const currentDate = new Date();
    const deadlineDate = new Date(this.currentVeranstaltung.meldeDeadline);
    // set the time of the dates to zero for comparing
    deadlineDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const notification: Notification = {
      id: NOTIFICATION_DELETE_WETTKAMPFTAG + id,
      title: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG.NOTIFICATION.DELETE.TITLE',
      description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity: NotificationSeverity.QUESTION,
      origin: NotificationOrigin.USER,
      type: NotificationType.YES_NO,
      userAction: NotificationUserAction.ACCEPTED
    };

    if (deadlineDate < currentDate) {
      this.deleteLoading = false;

      const notification_expired: Notification = {
        id:          NOTIFICATION_DELETE_WETTKAMPFTAG_SUCCESS,
        title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG.NOTIFICATION.DEADLINE_EXPIRED.TITLE',
        description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG.NOTIFICATION.DEADLINE_EXPIRED.DESCRIPTION',
        severity:    NotificationSeverity.ERROR,
        origin:      NotificationOrigin.USER,
        type:        NotificationType.OK,
        userAction:  NotificationUserAction.PENDING
      };

      this.notificationService.showNotification(notification_expired);

    } else {
      this.notificationService.observeNotification(NOTIFICATION_DELETE_WETTKAMPFTAG + id)
          .subscribe((myNotification) => {

            if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
              this.wettkampfDataProvider.deleteById(id)
                  .then((response) => this.handleDeleteSuccess(response))
                  .catch((response) => this.handleDeleteFailure(response));
            } else if (myNotification.userAction === NotificationUserAction.DECLINED) {
              this.deleteLoading = false;
            }
          });
      this.notificationService.showNotification(notification);
    }
  }

  public entityExists(): boolean {
    return this.currentVeranstaltung.id >= 0;
  }

  private loadById(id: number) {
    this.veranstaltungDataProvider.findById(id)
        .then((response: BogenligaResponse<VeranstaltungDO>) => this.handleSuccess(response))
        .catch((response: BogenligaResponse<VeranstaltungDO>) => this.handleFailure(response));
  }

  private loadConfigParam(id: number) {
    // loads a parameter from the configurations by an id
    this.einstellungenProvider.findById(id)
        .then((response: BogenligaResponse<EinstellungenDO>) => this.handleConfigSuccess(response))
        .catch((response: BogenligaResponse<EinstellungenDO>) => this.handleConfigFailure(response));
  }

  private loadLizenzen() {
    this.lizenzProvider.findAll()
        .then((response: BogenligaResponse<LizenzDO[]>) => this.handleLizenzResponseArraySuccess(response))
        .catch((response: BogenligaResponse<LizenzDO[]>) => this.handleLizenzResponseArrayFailure(response)).then(() => this.loadDsbMitglieder());
  }

  private loadDsbMitglieder() {
    this.dsbMitgliedProvider.findAll()
        .then((response: BogenligaResponse<DsbMitgliedDO[]>) => this.handleDsbMitgliedResponseArraySuccess(response))
        .catch((response: BogenligaResponse<DsbMitgliedDO[]>) => this.handleDsbMitgliedResponseArrayFailure(response)).then(() => this.loadUser());
  }

  private loadUser() {
    this.userRolleProvider.findAll()
        .then((response: BogenligaResponse<UserRolleDO[]>) => this.handleUserRolleResponseArraySuccess(response))
        .catch((response: BogenligaResponse<UserRolleDTO[]>) => this.handleUserRolleResponseArrayFailure(response)).then();
  }

  private loadKampfrichter() {
    this.kampfrichterProvider.findExtendedByIdNotAssignedToId(this.selectedWettkampf.id)
        .then((response: BogenligaResponse<KampfrichterExtendedDO[]>) => this.handleKampfrichterResponseArraySuccess(response))
        .catch(() => this.handleKampfrichterResponseArrayFailure());
  }

  private loadWettkampf() {
    this.wettkampfDataProvider.findAll()
        .then((response: BogenligaResponse<WettkampfDO[]>) => this.handleWettkampfResponseArraySucces(response))
        .catch((response: BogenligaResponse<WettkampfDTO[]>) => this.handleWettkampfResponseArrayFailure(response)).then(() => this.loadUsers());
  }

  private async handleSuccess(response: BogenligaResponse<VeranstaltungDO>) {
    this.currentVeranstaltung = response.payload;
    this.loading = false;
    this.loadWettkampf();
    await this.loadDistinctWettkampf();
    this.selectedWettkampf = this.selectedDTOs[0];
    this.loadKampfrichter();
    this.loadLizenzen();
  }

  private handleFailure(response: BogenligaResponse<VeranstaltungDO>) {
    this.loading = false;
  }

  private handleConfigSuccess(response: BogenligaResponse<EinstellungenDO>) {
    // loading configurations successful
    this.maxWettkampftageEinstellungenDO = response.payload;
    this.loading = false;
  }

  private handleConfigFailure(response: BogenligaResponse<EinstellungenDO>) {
    // loading configurations failure
    this.loading = false;
  }

  private handleDeleteSuccess(response: BogenligaResponse<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_WETTKAMPFTAG_SUCCESS,
      title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG.NOTIFICATION.DELETE_SUCCESS.TITLE',
      description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG.NOTIFICATION.DELETE_SUCCESS.DESCRIPTION',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_WETTKAMPFTAG_SUCCESS)
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
      id:          NOTIFICATION_DELETE_WETTKAMPFTAG_FAILURE,
      title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG.NOTIFICATION.DELETE_FAILURE.TITLE',
      description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG.NOTIFICATION.DELETE_FAILURE.DESCRIPTION',
      severity:    NotificationSeverity.ERROR,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_WETTKAMPFTAG_FAILURE)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleWettkampfResponseArraySucces(response: BogenligaResponse<WettkampfDO[]>): void {
    this.allWettkampf = [];
    this.allWettkampf = response.payload;
    this.allWettkampf = this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfVeranstaltungsId === this.currentVeranstaltung.id);

    for (let i = 1; i <= this.allWettkampf.length; i++) {
      if (this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === (i)).length === 0) {
        this.currentWettkampftagArray[i] = new WettkampfDO();
      } else {
        this.currentWettkampftagArray[i] = this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === i)[0];
      }
    }

    this.loading = false;
  }

  private handleWettkampfResponseArrayFailure(response: BogenligaResponse<WettkampfDTO[]>): void {
    this.loading = false;
  }

  private handleLizenzResponseArraySuccess(response: BogenligaResponse<LizenzDO[]>): void {
    this.allKampfrichterLizenzen = response.payload;
    this.allKampfrichterLizenzen = this.allKampfrichterLizenzen.filter((lizenz) => lizenz.lizenztyp === 'Kampfrichter');
  }

  private handleLizenzResponseArrayFailure(response: BogenligaResponse<LizenzDO[]>): void {
    this.allKampfrichterLizenzen = [];
  }

  private handleDsbMitgliedResponseArraySuccess(response: BogenligaResponse<DsbMitgliedDO[]>): void {
    const allDsbMitglieder: Array<DsbMitgliedDO> = response.payload;
    this.allDsbMitgliederWithKampfrichterLizenz = [];
    for (const i of Object.keys(this.allKampfrichterLizenzen)) {
      this.allDsbMitgliederWithKampfrichterLizenz.push(allDsbMitglieder.filter((dsbMitglied) => dsbMitglied.id === this.allKampfrichterLizenzen[i].lizenzDsbMitgliedId)[0]);
    }
  }

  private handleDsbMitgliedResponseArrayFailure(response: BogenligaResponse<DsbMitgliedDO[]>): void {
    this.allDsbMitgliederWithKampfrichterLizenz = [];
  }

  private handleUserRolleResponseArraySuccess(response: BogenligaResponse<UserRolleDO[]>): void {
    const allUser: Array<UserRolleDO> = response.payload;
    const validDsbMitglieder: Array<number> = [];
    this.allUserWithKampfrichterLizenz = [];
    for (const i of Object.keys(this.allDsbMitgliederWithKampfrichterLizenz)) {
      if (!isNullOrUndefined(this.allDsbMitgliederWithKampfrichterLizenz[i].userId)) {
        validDsbMitglieder.push(Number(i));
      }
    }
    for (const i of Object.keys(validDsbMitglieder)) {
      this.allUserWithKampfrichterLizenz.push(allUser.filter((userRolle) => userRolle.id === this.allDsbMitgliederWithKampfrichterLizenz[validDsbMitglieder[i]].userId)[0]);
    }

    this.loading = false;
  }

  private handleUserRolleResponseArrayFailure(response: BogenligaResponse<UserRolleDTO[]>): void {
    this.allUserWithKampfrichterLizenz = [];
    this.loading = false;
  }

  private async handleKampfrichterResponseArraySuccess(response: BogenligaResponse<KampfrichterExtendedDO[]>): Promise<void> {

    this.selectedKampfrichterBeforeSave[this.selectedWettkampfTag] = [];
    this.notSelectedKampfrichterBeforeSave[this.selectedWettkampfTag] = [];

    this.selectedKampfrichter[this.selectedWettkampfTag] = [];
    this.notSelectedKampfrichter[this.selectedWettkampfTag] = [];

    this.notSelectedKampfrichter[this.selectedWettkampfTag] = response.payload; // links

    await this.kampfrichterProvider.findExtendedByIdAssignedToId(this.selectedWettkampf.id).then((reply) => {
      this.selectedKampfrichter[this.selectedWettkampfTag] = reply.payload; // rechts
    }).catch(() => this.handleKampfrichterResponseArrayFailure());


    this.selectedKampfrichter[this.selectedWettkampfTag].forEach((x) => {
      this.selectedKampfrichterBeforeSave[this.selectedWettkampfTag].push(x);
    });

    this.notSelectedKampfrichter[this.selectedWettkampfTag].forEach((x) => {
      this.notSelectedKampfrichterBeforeSave[this.selectedWettkampfTag].push(x);
    });

    this.loading = false;
  }

  private handleKampfrichterResponseArrayFailure(): void {
    console.log('KampfrichterResponseArrayFailure');
    this.loading = false;
  }

  // loads all existing Wettkampftage from Backend
  private async loadDistinctWettkampf(): Promise<void> {
    this.loadingWettkampf = true;
    await this.wettkampfDataProvider.findAll()
        .then((newList: BogenligaResponse<WettkampfDO[]>) => this.handleLoadDistinctWettkampfSuccess(newList))
        .catch((newList: BogenligaResponse<WettkampfDTO[]>) => this.handleLoadDistinctWettkampfFailure(newList));
  }

  // when loading was succesfull, filter Wettkampftage depending on Veranstaltung
  private async handleLoadDistinctWettkampfSuccess(response: BogenligaResponse<WettkampfDO[]>): Promise<void> {
    this.selectedDTOs = [];
    this.selectedDTOs = response.payload.filter((element) => element.wettkampfVeranstaltungsId === this.currentVeranstaltung.id);
    this.anzahl = this.selectedDTOs.length;

    // when there are no Wettkampftage for this Veranstaltung yet
    if (this.selectedDTOs.length === 0) {
      this.selectedDTOs.push(new WettkampfDO());
      await this.createInitWettkampfTag(1);
      this.loadDistinctWettkampf();
    }
    this.loadingWettkampf = false;
  }


  // when loading failed
  private handleLoadDistinctWettkampfFailure(response: BogenligaResponse<WettkampfDTO[]>): void {
    this.selectedDTOs = [];
    this.loadingWettkampf = false;
  }

  // onSelect for SelectionList in html-file, loads currently selected Wettkampftag
  public onSelect($event: WettkampfDO[]): void {
    console.log('selected:', $event);
    this.selectedWettkampfTag = $event[0].wettkampfTag;
    this.selectedWettkampf = $event[0];
    console.log('onSelect Dialog: ' + this.selectedWettkampfTag);
    this.loadWettkampf();
    this.loadDistinctWettkampf();
    this.loadKampfrichter();
  }

  // create an empty Wettkampftag
  public async createInitWettkampfTag(num: number): Promise<boolean> {
    console.log(Number(this.maxWettkampftageEinstellungenDO.value));
    if (this.anzahl < Number(this.maxWettkampftageEinstellungenDO.value)) {
      this.anzahl++;
      const temp: WettkampfDO = new WettkampfDO(
        num,
        this.currentVeranstaltung.id,
        '2021-01-01',
        '',
        '',
        '',
        '',
        '',
        this.anzahl,
        1,
        1,
        1,
        1
      );
      this.currentWettkampftagArray[num] = temp;
      await this.saveWettkampftag(this.currentWettkampftagArray[num]);
    } else {
      const notification: Notification = {
        id:          NOTIFICATION_WETTKAMPFTAG_TOO_MANY,
        title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG.NOTIFICATION.TOO_MANY.TITLE',
        description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG.NOTIFICATION.TOO_MANY.DESCRIPTION',
        severity:    NotificationSeverity.ERROR,
        origin:      NotificationOrigin.USER,
        type:        NotificationType.OK,
        userAction:  NotificationUserAction.PENDING
      };

      this.wettkampftagService();
      this.notificationService.showNotification(notification);
    }
    return true;
  }

  // Wenn nicht alle Felder von allen Wettkampftagen befüllt sind, gibt es einen Error
  public async updateNumbersDelete(): Promise<boolean> {
    // TODO Alle existierende Wettkampftage müssen komplett ausgefüllt und abgespeichert sein, Wenn ein Attribut fehlt, funktioniert die Updatefunktion nicht

    this.loadWettkampf();
    this.loadDistinctWettkampf();

    if (this.selectedWettkampfTag != this.currentWettkampftagArray.length) {    // Wenn letzter Wettkampftag gelöscht werden soll, muss Nummerierung nicht angepasst werden
      for (let i = this.selectedWettkampfTag + 1; i < this.currentWettkampftagArray.length; i++) {   // Man beginnt im Array, ein Tag weiter als der aktuelle (Welcher gelöscht werden soll)
        console.log('Wettkampftag vorher: ' + this.currentWettkampftagArray[i].wettkampfTag);
        console.log('i = ' + i);
        this.currentWettkampftagArray[i].wettkampfTag --;     // Wettkampftagnummer wird dekrementiert

        console.log('Wettkampftag danach: ' + this.currentWettkampftagArray[i].wettkampfTag);

        if (this.currentWettkampftagArray[i].wettkampfTag == null) {
          console.log('wettkampf doesnt exist');
        } else {
          await this.wettkampfDataProvider.update(this.currentWettkampftagArray[i]);    // Wettkampftag mit aktualisierter Wettkampftagnummer speichern
          this.currentWettkampftagArray[i - 1] = this.currentWettkampftagArray[i];      // Position im Array verschieben
        }
      }
    }
    this.loadDistinctWettkampf();
    return true;
  }

  // Creates Copy of current Wettkampftag
  public async copyCurrentWettkampfTag(num: number): Promise<boolean> {
    if (this.anzahl < Number(this.maxWettkampftageEinstellungenDO.value)) {
      this.anzahl++;

      // parsing current date
      const currentYear = Number(this.currentWettkampftagArray[this.selectedWettkampfTag].wettkampfDatum.substring(0, 4));
      const currentMonth = Number(this.currentWettkampftagArray[this.selectedWettkampfTag].wettkampfDatum.substring(5, 7));
      const currentDate = Number(this.currentWettkampftagArray[this.selectedWettkampfTag].wettkampfDatum.substring(8, 10));

      // creating new Date object with parsed year, month and day and incrementing it by + 1
      const nextWettkampfDatum = new Date();
      nextWettkampfDatum.setFullYear(currentYear, currentMonth, currentDate);
      nextWettkampfDatum.setDate(nextWettkampfDatum.getDate() + 1);

      // parsing incremented Date
      const incrementedYear = nextWettkampfDatum.getFullYear();
      const incrementedMonth = nextWettkampfDatum.getMonth();
      const incrementedDate = nextWettkampfDatum.getDate();

      // constructing date string
      let incrementedWettkampfDatum = incrementedYear.toString() + '-';

      // adding leading 0 to months < 10
      if (incrementedMonth < 10) {
        incrementedWettkampfDatum += '0';
      }
      incrementedWettkampfDatum += incrementedMonth.toString() + '-';

      // adding leading 0 to dates < 10
      if (incrementedDate < 10) {
        incrementedWettkampfDatum += '0';
      }
      incrementedWettkampfDatum += incrementedDate.toString();

      const temp: WettkampfDO = new WettkampfDO(
        num,
        this.currentVeranstaltung.id,
        incrementedWettkampfDatum,
        this.currentWettkampftagArray[this.selectedWettkampfTag].wettkampfStrasse.toString(),
        this.currentWettkampftagArray[this.selectedWettkampfTag].wettkampfPlz.toString(),
        this.currentWettkampftagArray[this.selectedWettkampfTag].wettkampfOrtsname.toString(),
        this.currentWettkampftagArray[this.selectedWettkampfTag].wettkampfOrtsinfo.toString(),
        this.currentWettkampftagArray[this.selectedWettkampfTag].wettkampfBeginn.toString(),
        this.anzahl,
        1,
        1,
        1,
        1
      );
      this.currentWettkampftagArray[num] = temp;
      await this.saveWettkampftag(this.currentWettkampftagArray[num]);
    } else {
      const notification: Notification = {
        id:          NOTIFICATION_WETTKAMPFTAG_TOO_MANY,
        title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG.NOTIFICATION.TOO_MANY.TITLE',
        description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG.NOTIFICATION.TOO_MANY.DESCRIPTION',
        severity:    NotificationSeverity.ERROR,
        origin:      NotificationOrigin.USER,
        type:        NotificationType.OK,
        userAction:  NotificationUserAction.PENDING
      };

      this.wettkampftagService();
      this.notificationService.showNotification(notification);
    }
    return true;
  }

  public getTranslation(key: string) {
    return this.translate.transform(key);
  }
}
