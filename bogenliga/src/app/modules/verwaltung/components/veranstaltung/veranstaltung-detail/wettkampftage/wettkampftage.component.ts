import {Component, NgModule, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonComponentDirective} from '@shared/components';
import {ButtonType} from '@shared/components';
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
import {BenutzerRolleDO} from '@verwaltung/types/benutzer-rolle-do.class';
import {BenutzerRolleDTO} from '@verwaltung/types/datatransfer/benutzer-rolle-dto.class';
import {BenutzerDataProviderService} from '../../../../services/benutzer-data-provider.service';
import {KampfrichterDO} from '@verwaltung/types/kampfrichter-do.class';
import {KampfrichterDTO} from '@verwaltung/types/datatransfer/kampfrichter-dto.class';
import {KampfrichterProviderService} from '../../../../services/kampfrichter-data-provider.service';
import {LigaDataProviderService} from '@verwaltung/services/liga-data-provider.service';
import {LizenzDO} from '@verwaltung/types/lizenz-do.class';
import {DsbMitgliedDO} from '@verwaltung/types/dsb-mitglied-do.class';
import {DsbMitgliedDataProviderService} from '@verwaltung/services/dsb-mitglied-data-provider.service';
import {LizenzDataProviderService} from '@verwaltung/services/lizenz-data-provider.service';
import {log} from 'util';


const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_VERANSTALTUNG = 'veranstaltung_detail_delete';
const NOTIFICATION_DELETE_VERANSTALTUNG_SUCCESS = 'veranstaltung_detail_delete_success';
const NOTIFICATION_DELETE_VERANSTALTUNG_FAILURE = 'veranstaltung_detail_delete_failure';
const NOTIFICATION_SAVE_VERANSTALTUNG = 'veranstaltung_detail_save';
const NOTIFICATION_UPDATE_VERANSTALTUNG = 'veranstaltung_detail_update';

const wettkampfTagNotification: Notification = {
  id:          NOTIFICATION_SAVE_VERANSTALTUNG,
  title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG1.NOTIFICATION.SAVE.TITLE',
  description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG1.NOTIFICATION.SAVE.DESCRIPTION',
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
  styleUrls:   ['./wettkampftage.component.scss']
})

export class WettkampftageComponent extends CommonComponentDirective implements OnInit {
  public config = WETTKAMPFTAGE_CONFIG;
  public ButtonType = ButtonType;

  public currentVeranstaltung: VeranstaltungDO = new VeranstaltungDO();

  public currentUser: UserProfileDO;

  public currentWettkampftag_1: WettkampfDO = new WettkampfDO();
  public currentWettkampftag_2: WettkampfDO = new WettkampfDO();
  public currentWettkampftag_3: WettkampfDO = new WettkampfDO();
  public currentWettkampftag_4: WettkampfDO = new WettkampfDO();
  public allWettkampf: Array<WettkampfDO> = [];

  public currentAusrichter1: UserProfileDO = new UserProfileDO();
  public currentAusrichter2: UserProfileDO = new UserProfileDO();
  public currentAusrichter3: UserProfileDO = new UserProfileDO();
  public currentAusrichter4: UserProfileDO = new UserProfileDO();
  public allUsers: Array<UserProfileDO> = [new UserProfileDO()];

  public deleteLoading = false;
  public saveLoading = false;

  public id;

  public allKampfrichterLizenzen: Array<LizenzDO> = [];
  public allDsbMitgliederWithKampfrichterLizenz: Array<DsbMitgliedDO> = [];
  public allBenutzerWithKampfrichterLizenz: Array<BenutzerRolleDO> = [];

  public kampfrichterTag1: Array<KampfrichterDO> = [];
  public kampfrichterTag2: Array<KampfrichterDO> = [];
  public kampfrichterTag3: Array<KampfrichterDO> = [];
  public kampfrichterTag4: Array<KampfrichterDO> = [];

  public initiallySelectedKampfrichterTag1: Array<BenutzerRolleDO> = [];
  public initiallySelectedKampfrichterTag2: Array<BenutzerRolleDO> = [];
  public initiallySelectedKampfrichterTag3: Array<BenutzerRolleDO> = [];
  public initiallySelectedKampfrichterTag4: Array<BenutzerRolleDO> = [];

  public selectedKampfrichterTag1: Array<BenutzerRolleDO> = [];
  public selectedKampfrichterTag2: Array<BenutzerRolleDO> = [];
  public selectedKampfrichterTag3: Array<BenutzerRolleDO> = [];
  public selectedKampfrichterTag4: Array<BenutzerRolleDO> = [];

  public notSelectedKampfrichterWettkampftag1: Array<BenutzerRolleDO> = [];
  public notSelectedKampfrichterWettkampftag2: Array<BenutzerRolleDO> = [];
  public notSelectedKampfrichterWettkampftag3: Array<BenutzerRolleDO> = [];
  public notSelectedKampfrichterWettkampftag4: Array<BenutzerRolleDO> = [];

  constructor(
    private veranstaltungDataProvider: VeranstaltungDataProviderService,
    private wettkampfDataProvider: WettkampfDataProviderService,
    private userProvider: UserProfileDataProviderService,
    private lizenzProvider: LizenzDataProviderService,
    private dsbMitgliedProvider: DsbMitgliedDataProviderService,
    private benutzerRolleProvider: BenutzerDataProviderService,
    private kampfrichterProvider: KampfrichterProviderService,
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
    this.currentAusrichter1 = this.allUsers.filter((user) => user.id === this.currentWettkampftag_1.wettkampfAusrichter)[0] ?? this.allUsers[0];
    this.currentAusrichter2 = this.allUsers.filter((user) => user.id === this.currentWettkampftag_2.wettkampfAusrichter)[0] ?? this.allUsers[0];
    this.currentAusrichter3 = this.allUsers.filter((user) => user.id === this.currentWettkampftag_3.wettkampfAusrichter)[0] ?? this.allUsers[0];
    this.currentAusrichter4 = this.allUsers.filter((user) => user.id === this.currentWettkampftag_4.wettkampfAusrichter)[0] ?? this.allUsers[0];

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
    let currentWettkampftag: WettkampfDO;
    let currentAusrichter: UserProfileDO;

    switch (wettkampfTagNumber) {
      case 1:
        currentWettkampftag = this.currentWettkampftag_1;
        currentAusrichter = this.currentAusrichter1;
        currentWettkampftag.wettkampfTag = 1;
        break;
      case 2:
        currentWettkampftag = this.currentWettkampftag_2;
        currentAusrichter = this.currentAusrichter2;
        currentWettkampftag.wettkampfTag = 2;
        break;
      case 3:
        currentWettkampftag = this.currentWettkampftag_3;
        currentAusrichter = this.currentAusrichter3;
        currentWettkampftag.wettkampfTag = 3;
        break;
      case 4:
        currentWettkampftag = this.currentWettkampftag_4;
        currentAusrichter = this.currentAusrichter4;
        currentWettkampftag.wettkampfTag = 4;
    }
    currentWettkampftag.wettkampfVeranstaltungsId = this.currentVeranstaltung.id;
    currentWettkampftag.wettkampfDisziplinId = 0;
    currentWettkampftag.wettkampfTypId = this.currentVeranstaltung.wettkampfTypId;
    currentWettkampftag.wettkampfAusrichter = currentAusrichter.id;

    if (currentWettkampftag.id == null) {
      // die Daten sind initial angelegt - es exitsiert noch keine ID --> Save nicht update
      const wettkampfID: number = await this.saveWettkampftag(currentWettkampftag);
      currentWettkampftag.id = wettkampfID;
      return wettkampfID;
    } else {
      this.updateWettkampftag(currentWettkampftag);
    }
    return currentWettkampftag.id;
  }

  public updateKampfrichter(wettkampfTagNumber: number, wettkampfID: number): void {
    let currentWettkampftag: WettkampfDO;
    let kampfrichterBenutzerToSave: Array<BenutzerRolleDO> = [];
    let kampfrichterBenutzerToDelete: Array<BenutzerRolleDO> = [];

    switch (wettkampfTagNumber) {
      case 1:
        currentWettkampftag = this.currentWettkampftag_1;
        kampfrichterBenutzerToSave = this.selectedKampfrichterTag1.filter(comparer(this.initiallySelectedKampfrichterTag1));
        kampfrichterBenutzerToDelete = this.initiallySelectedKampfrichterTag1.filter(comparer(this.selectedKampfrichterTag1));
        break;
      case 2:
        currentWettkampftag = this.currentWettkampftag_2;
        kampfrichterBenutzerToSave = this.selectedKampfrichterTag2.filter(comparer(this.initiallySelectedKampfrichterTag2));
        kampfrichterBenutzerToDelete = this.initiallySelectedKampfrichterTag2.filter(comparer(this.selectedKampfrichterTag2));
        break;
      case 3:
        currentWettkampftag = this.currentWettkampftag_3;
        kampfrichterBenutzerToSave = this.selectedKampfrichterTag3.filter(comparer(this.initiallySelectedKampfrichterTag3));
        kampfrichterBenutzerToDelete = this.initiallySelectedKampfrichterTag3.filter(comparer(this.selectedKampfrichterTag3));
        break;
      case 4:
        currentWettkampftag = this.currentWettkampftag_4;
        kampfrichterBenutzerToSave = this.selectedKampfrichterTag4.filter(comparer(this.initiallySelectedKampfrichterTag4));
        kampfrichterBenutzerToDelete = this.initiallySelectedKampfrichterTag4.filter(comparer(this.selectedKampfrichterTag4));
    }

    const kampfrichterToSave: Array<KampfrichterDO> = [];
    for (const i of Object.keys(kampfrichterBenutzerToSave)) {
      kampfrichterToSave.push(new KampfrichterDO());
      kampfrichterToSave[i].id = kampfrichterBenutzerToSave[i].id;
      kampfrichterToSave[i].wettkampfID = wettkampfID;
      kampfrichterToSave[i].leitend = false;
    }

    const kampfrichterToDelete: Array<KampfrichterDO> = [];
    for (const i of Object.keys(kampfrichterBenutzerToDelete)) {
      kampfrichterToDelete.push(new KampfrichterDO());
      kampfrichterToDelete[i].id = kampfrichterBenutzerToDelete[i].id;
      kampfrichterToDelete[i].wettkampfID = currentWettkampftag.id;
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
               .then((response: BogenligaResponse<WettkampfDO>) => {
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
              title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG1.NOTIFICATION.UPDATE.TITLE',
              description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG1.NOTIFICATION.UPDATE.DESCRIPTION',
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
                title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG1.NOTIFICATION.SAVE.TITLE',
                description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG1.NOTIFICATION.SAVE.DESCRIPTION',
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
          }
        });

    this.notificationService.showNotification(notification);
  }

  public entityExists(): boolean {
    return this.currentVeranstaltung.id >= 0;
  }

  private loadById(id: number) {
    this.veranstaltungDataProvider.findById(id)
        .then((response: BogenligaResponse<VeranstaltungDO>) => this.handleSuccess(response))
        .catch((response: BogenligaResponse<VeranstaltungDO>) => this.handleFailure(response));
  }

  private loadLizenzen() {
    this.lizenzProvider.findAll()
        .then((response: BogenligaResponse<LizenzDO[]>) => this.handleLizenzResponseArraySuccess(response))
        .catch((response: BogenligaResponse<LizenzDO[]>) => this.handleLizenzResponseArrayFailure(response)).then(() => this.loadDsbMitglieder());
  }

  private loadDsbMitglieder() {
    this.dsbMitgliedProvider.findAll()
        .then((response: BogenligaResponse<DsbMitgliedDO[]>) => this.handleDsbMitgliedResponseArraySuccess(response))
        .catch((response: BogenligaResponse<DsbMitgliedDO[]>) => this.handleDsbMitgliedResponseArrayFailure(response)).then(() => this.loadBenutzer());
  }

  private loadBenutzer() {
    this.benutzerRolleProvider.findAll()
        .then((response: BogenligaResponse<BenutzerRolleDO[]>) => this.handleBenutzerRolleResponseArraySuccess(response))
        .catch((response: BogenligaResponse<BenutzerRolleDTO[]>) => this.handleBenutzerRolleResponseArrayFailure(response)).then(() => this.loadKampfrichter());
  }

  private loadKampfrichter() {
    this.kampfrichterProvider.findAll()
        .then((response: BogenligaResponse<KampfrichterDO[]>) => this.handleKampfrichterResponseArraySuccess(
          response
        ))
        .catch((response: BogenligaResponse<KampfrichterDTO[]>) => this.handleKampfrichterResponseArrayFailure(response));
  }

  private loadWettkampf() {
    this.wettkampfDataProvider.findAll()
        .then((response: BogenligaResponse<WettkampfDO[]>) => this.handleWettkampfResponseArraySuccess(response))
        .catch((response: BogenligaResponse<WettkampfDTO[]>) => this.handleWettkampfResponseArrayFailure(response)).then(() => this.loadUsers());
  }

  private handleSuccess(response: BogenligaResponse<VeranstaltungDO>) {
    this.currentVeranstaltung = response.payload;
    this.loading = false;
    this.loadWettkampf();
    this.loadLizenzen();
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


  private handleWettkampfResponseArraySuccess(response: BogenligaResponse<WettkampfDO[]>): void {
    this.allWettkampf = [];
    this.allWettkampf = response.payload;
    this.allWettkampf = this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfVeranstaltungsId === this.currentVeranstaltung.id);

    if (this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 1).length === 0) {
      this.currentWettkampftag_1 = new WettkampfDO();
    } else {
      this.currentWettkampftag_1 = this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 1)[0];
    }

    if (this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 2).length === 0) {
      this.currentWettkampftag_2 = new WettkampfDO();
    } else {
      this.currentWettkampftag_2 = this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 2)[0];
    }

    if (this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 3).length === 0) {
      this.currentWettkampftag_3 = new WettkampfDO();
    } else {
      this.currentWettkampftag_3 = this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 3)[0];
    }

    if (this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 4).length === 0) {
      this.currentWettkampftag_4 = new WettkampfDO();
    } else {
      this.currentWettkampftag_4 = this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 4)[0];
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

  private handleBenutzerRolleResponseArraySuccess(response: BogenligaResponse<BenutzerRolleDO[]>): void {
    const allBenutzer: Array<BenutzerRolleDO> = response.payload;
    const validDsbMitglieder: Array<number> = [];
    this.allBenutzerWithKampfrichterLizenz = [];
    for (const i of Object.keys(this.allDsbMitgliederWithKampfrichterLizenz)) {
      if (!isNullOrUndefined(this.allDsbMitgliederWithKampfrichterLizenz[i].userId)) {
        validDsbMitglieder.push(Number(i));
      }
    }
    for (const i of Object.keys(validDsbMitglieder)) {
      this.allBenutzerWithKampfrichterLizenz.push(allBenutzer.filter((benutzerRolle) => benutzerRolle.id === this.allDsbMitgliederWithKampfrichterLizenz[validDsbMitglieder[i]].userId)[0]);
    }

    this.loading = false;
  }

  private handleBenutzerRolleResponseArrayFailure(response: BogenligaResponse<BenutzerRolleDTO[]>): void {
    this.allBenutzerWithKampfrichterLizenz = [];
    this.loading = false;
  }

  private handleKampfrichterResponseArraySuccess(
    response: BogenligaResponse<KampfrichterDO[]>
  ): void {
    let allKampfrichter: Array<KampfrichterDO> = [];

    allKampfrichter = response.payload;

    this.kampfrichterTag1 = [];

    allKampfrichter.filter((kampfrichter) => kampfrichter.wettkampfID === this.currentWettkampftag_1.id).forEach((kampfrichter) => this.kampfrichterTag1.push(Object.assign({}, kampfrichter)));

    if (this.kampfrichterTag1[0] !== undefined) {
      for (const iter of Object.keys(this.kampfrichterTag1)) {
        this.initiallySelectedKampfrichterTag1.push(this.allBenutzerWithKampfrichterLizenz.filter((user) => user.id === this.kampfrichterTag1[iter].id)[0]);
      }
    }

    this.initiallySelectedKampfrichterTag1.forEach((val) => this.selectedKampfrichterTag1.push(Object.assign({}, val)));
    this.notSelectedKampfrichterWettkampftag1 = this.allBenutzerWithKampfrichterLizenz.filter((user) => this.initiallySelectedKampfrichterTag1.indexOf(user) < 0);

    this.kampfrichterTag2 = [];

    allKampfrichter.filter((kampfrichter) => kampfrichter.wettkampfID === this.currentWettkampftag_2.id).forEach((kampfrichter) => this.kampfrichterTag2.push(Object.assign({}, kampfrichter)));

    if (this.kampfrichterTag2[0] !== undefined) {
      for (const iter of Object.keys(this.kampfrichterTag2)) {
        this.initiallySelectedKampfrichterTag2.push(this.allBenutzerWithKampfrichterLizenz.filter((user) => user.id === this.kampfrichterTag2[iter].id)[0]);
      }
    }

    this.initiallySelectedKampfrichterTag2.forEach((val) => this.selectedKampfrichterTag2.push(Object.assign({}, val)));
    this.notSelectedKampfrichterWettkampftag2 = this.allBenutzerWithKampfrichterLizenz.filter((user) => this.initiallySelectedKampfrichterTag2.indexOf(user) < 0);

    this.kampfrichterTag3 = [];

    allKampfrichter.filter((kampfrichter) => kampfrichter.wettkampfID === this.currentWettkampftag_3.id).forEach((kampfrichter) => this.kampfrichterTag3.push(Object.assign({}, kampfrichter)));

    if (this.kampfrichterTag3[0] !== undefined) {
      for (const iter of Object.keys(this.kampfrichterTag3)) {
        this.initiallySelectedKampfrichterTag3.push(this.allBenutzerWithKampfrichterLizenz.filter((user) => user.id === this.kampfrichterTag3[iter].id)[0]);
      }
    }

    this.initiallySelectedKampfrichterTag3.forEach((val) => this.selectedKampfrichterTag3.push(Object.assign({}, val)));
    this.notSelectedKampfrichterWettkampftag3 = this.allBenutzerWithKampfrichterLizenz.filter((user) => this.initiallySelectedKampfrichterTag3.indexOf(user) < 0);

    this.kampfrichterTag4 = [];

    allKampfrichter.filter((kampfrichter) => kampfrichter.wettkampfID === this.currentWettkampftag_4.id).forEach((kampfrichter) => this.kampfrichterTag4.push(Object.assign({}, kampfrichter)));

    if (this.kampfrichterTag4[0] !== undefined) {
      for (const iter of Object.keys(this.kampfrichterTag4)) {
        this.initiallySelectedKampfrichterTag4.push(this.allBenutzerWithKampfrichterLizenz.filter((user) => user.id === this.kampfrichterTag4[iter].id)[0]);
      }
    }

    this.initiallySelectedKampfrichterTag4.forEach((val) => this.selectedKampfrichterTag4.push(Object.assign({}, val)));
    this.notSelectedKampfrichterWettkampftag4 = this.allBenutzerWithKampfrichterLizenz.filter((user) => this.initiallySelectedKampfrichterTag4.indexOf(user) < 0);

    this.loading = false;
  }

  private handleKampfrichterResponseArrayFailure(response: BogenligaResponse<KampfrichterDTO[]>): void {
    this.loading = false;
  }
}
