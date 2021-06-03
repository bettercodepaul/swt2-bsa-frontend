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
import {UserRolleDO} from '@verwaltung/types/user-rolle-do.class';
import {UserRolleDTO} from '@verwaltung/types/datatransfer/user-rolle-dto.class';
import {UserDataProviderService} from '../../../../services/user-data-provider.service';
import {KampfrichterDO} from '@verwaltung/types/kampfrichter-do.class';
import {KampfrichterDTO} from '@verwaltung/types/datatransfer/kampfrichter-dto.class';
import {KampfrichterProviderService} from '../../../../services/kampfrichter-data-provider.service';
import {LigaDataProviderService} from '@verwaltung/services/liga-data-provider.service';
import {LizenzDO} from '@verwaltung/types/lizenz-do.class';
import {DsbMitgliedDO} from '@verwaltung/types/dsb-mitglied-do.class';
import {DsbMitgliedDataProviderService} from '@verwaltung/services/dsb-mitglied-data-provider.service';
import {LizenzDataProviderService} from '@verwaltung/services/lizenz-data-provider.service';
import {callbackify, log} from 'util';
import {of} from 'rxjs';
import {element} from 'protractor';
import { TableRow } from '@shared/components/tables/types/table-row.class';
//import {log} from 'util';
//import {TableRow} from '@shared/components/tables/types/table-row.class';
import {RegionDO} from '@verwaltung/types/region-do.class';
import {SportjahrVeranstaltungDO} from '@verwaltung/types/sportjahr-veranstaltung-do';
import {SportjahrVeranstaltungDTO} from '@verwaltung/types/datatransfer/sportjahr-veranstaltung-dto';
import {VeranstaltungDTO} from '@verwaltung/types/datatransfer/veranstaltung-dto.class';



const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_VERANSTALTUNG = 'veranstaltung_detail_delete';
const NOTIFICATION_DELETE_VERANSTALTUNG_SUCCESS = 'veranstaltung_detail_delete_success';
const NOTIFICATION_DELETE_VERANSTALTUNG_FAILURE = 'veranstaltung_detail_delete_failure';
const NOTIFICATION_SAVE_VERANSTALTUNG = 'veranstaltung_detail_save';
const NOTIFICATION_UPDATE_VERANSTALTUNG = 'veranstaltung_detail_update';

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
  styleUrls:   ['./wettkampftage.component.scss']
})

export class WettkampftageComponent extends CommonComponentDirective implements OnInit {
  public config = WETTKAMPFTAGE_CONFIG;
  public ButtonType = ButtonType;

  public currentVeranstaltung: VeranstaltungDO = new VeranstaltungDO();

  public currentUser: UserProfileDO;
  public rows: TableRow[];
  private selectedVeranstaltungsId: number;
  public currentWettkampftagDO: WettkampfDO;

  public currentWettkampftag: WettkampfDO = new WettkampfDO();
  public currentWettkampftagArray: Array<WettkampfDO> = [];
  public allWettkampf: Array<WettkampfDO> = [];

  public currentAusrichter: Array<UserProfileDO> = [];
  public allUsers: Array<UserProfileDO> = [new UserProfileDO()];

  public deleteLoading = false;
  public saveLoading = false;
  public savedByUser = false;

  public id;

  public allKampfrichterLizenzen: Array<LizenzDO> = [];
  public allDsbMitgliederWithKampfrichterLizenz: Array<DsbMitgliedDO> = [];
  public allUserWithKampfrichterLizenz: Array<UserRolleDO> = [];

  public kampfrichterTag: Array<Array<KampfrichterDO>> = [];

  public initiallySelectedKampfrichterTag: Array<Array<UserRolleDO>> = [];

  public selectedKampfrichterTag: Array<Array<UserRolleDO>> = [];

  public notSelectedKampfrichterWettkampfTag: Array<Array<UserRolleDO>> = [];

  //public notSelectedKampfrichterWettkampftag4: Array<UserRolleDO> = []
  text = '. Wettkampftag';

  public selectedDTOs: WettkampfDO[];
  public loadingWettkampf = true;
  public selectedWettkampfTag: number = 1;


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
    private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.currentWettkampftagArray.push(new WettkampfDO());
    this.currentAusrichter.push(new UserProfileDO());
    this.currentWettkampftagArray.push(new WettkampfDO());
    this.currentAusrichter.push(new UserProfileDO());

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
          //this.loadUsers();   // This should only execute, when loadById has already finished!
        }
      }
    });
  }

  public onVeranstaltungDetail(ignore: any): void {
    this.navigateToWettkampftage(this.currentVeranstaltung);
  }

  private loadUsers() {
    this.userProvider.findAll()
        .then((response: BogenligaResponse<UserProfileDO[]>) => this.handleUserResponseArraySuccessNew(response))
        .catch((response: BogenligaResponse<UserProfileDTO[]>) => this.handleUserResponseArrayFailure(response));
  }

  private handleUserResponseArraySuccessNew(response: BogenligaResponse<UserProfileDO[]>): void{
    console.log('==> HandleUserResponseArraySuccess');
    this.allUsers = [];
    this.allUsers = response.payload;

    //this.currentAusrichter[1] = this.allUsers.filter((user) => user.id === this.currentWettkampftagArray[this.selectedWettkampfTag].wettkampfAusrichter)[0] ?? this.allUsers[0];

    //it should iterate through the complete array, to show all Ausrichter, but it works with only one call ?
    for(let i=1;i<=this.allUsers.length; i++){
      this.currentAusrichter[i] = this.allUsers.filter((user) => user.id === this.currentWettkampftagArray[i].wettkampfAusrichter)[0] ?? this.allUsers[0];
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
    this.savedByUser = true;
    this.saveWettkaempfeNew(wettkampfTagNumber).then((wettkampfID) => this.updateKampfrichterNew(wettkampfTagNumber, wettkampfID));
  }

  public async saveWettkaempfeNew(wettkampfTagNumber: number): Promise<number>{
    this.currentWettkampftagArray.push(new WettkampfDO());
    this.currentAusrichter.push(new UserProfileDO());

    let currentWettkampfTag: WettkampfDO;
    let currentAusrichter: UserProfileDO;

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

  public onAddWettkampfTag(ignore: any): void {
    this.savedByUser = false;
    this.currentWettkampftagArray.push(new WettkampfDO());

    this.createInitWettkampfTag((this.currentWettkampftagArray.length+1));

    this.loadDistinctWettkampf();
    this.loadWettkampf();

    //TODO Method to add Wettkampftage to a list
  }

  public updateKampfrichterNew(wettkampfTagNumber: number, wettkampfID: number): void{

    let currentWettkampftag: WettkampfDO;
    let kampfrichterUserToSave: Array<UserRolleDO> = [];
    let kampfrichterUserToDelete: Array<UserRolleDO> = [];

    currentWettkampftag = this.currentWettkampftagArray[wettkampfTagNumber];
    kampfrichterUserToSave = this.selectedKampfrichterTag[wettkampfTagNumber].filter(comparer(this.initiallySelectedKampfrichterTag[wettkampfTagNumber]));
    kampfrichterUserToDelete = this.initiallySelectedKampfrichterTag[wettkampfTagNumber].filter(comparer(this.selectedKampfrichterTag[wettkampfTagNumber]));

    const kampfrichterToSave: Array<KampfrichterDO> = [];
    for (const i of Object.keys(kampfrichterUserToSave)) {
      kampfrichterToSave.push(new KampfrichterDO());
      kampfrichterToSave[i].id = kampfrichterUserToSave[i].id;
      kampfrichterToSave[i].wettkampfID = wettkampfID;
      kampfrichterToSave[i].leitend = false;
    }

    const kampfrichterToDelete: Array<KampfrichterDO> = [];
    for (const i of Object.keys(kampfrichterUserToDelete)) {
      kampfrichterToDelete.push(new KampfrichterDO());
      kampfrichterToDelete[i].id = kampfrichterUserToDelete[i].id;
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
        .catch((response: BogenligaResponse<DsbMitgliedDO[]>) => this.handleDsbMitgliedResponseArrayFailure(response)).then(() => this.loadUser());
  }

  private loadUser() {
    this.userRolleProvider.findAll()
        .then((response: BogenligaResponse<UserRolleDO[]>) => this.handleUserRolleResponseArraySuccess(response))
        .catch((response: BogenligaResponse<UserRolleDTO[]>) => this.handleUserRolleResponseArrayFailure(response)).then(() => this.loadKampfrichter());
  }

  private loadKampfrichter() {
    this.kampfrichterProvider.findAll()
        .then((response: BogenligaResponse<KampfrichterDO[]>) => this.handleKampfrichterResponseArraySuccessNew(
          response
        ))
        .catch((response: BogenligaResponse<KampfrichterDTO[]>) => this.handleKampfrichterResponseArrayFailure(response));
  }

  private loadWettkampf() {
    this.wettkampfDataProvider.findAll()
        .then((response: BogenligaResponse<WettkampfDO[]>) => this.handleWettkampfResponseArraySuccesNew(response))
        .catch((response: BogenligaResponse<WettkampfDTO[]>) => this.handleWettkampfResponseArrayFailure(response)).then(() => this.loadUsers());
  }

  private handleSuccess(response: BogenligaResponse<VeranstaltungDO>) {
    this.currentVeranstaltung = response.payload;
    this.loading = false;
    this.loadWettkampf();
    this.loadLizenzen();
    this.loadDistinctWettkampf();
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

  private handleWettkampfResponseArraySuccesNew(response: BogenligaResponse<WettkampfDO[]>) : void {
    this.allWettkampf = [];
    this.allWettkampf = response.payload;
    this.allWettkampf = this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfVeranstaltungsId === this.currentVeranstaltung.id);

    for(let i=1; i<=this.allWettkampf.length;i++){
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


  private handleKampfrichterResponseArraySuccessNew(response: BogenligaResponse<KampfrichterDO[]>): void{
    let allKampfrichter: Array<KampfrichterDO> = [];
    allKampfrichter = response.payload;
    let tempKampfrichter: Array<KampfrichterDO> = [];
    let tempNotSelectedKampfrichterTag: Array<UserRolleDO> = [];

    for(let i = 1; i<=allKampfrichter.length; i++){
      this.kampfrichterTag[i]= [];

      tempKampfrichter = this.kampfrichterTag[i];
      tempNotSelectedKampfrichterTag = this.notSelectedKampfrichterWettkampfTag[i];

      allKampfrichter.filter((kampfrichter) => kampfrichter.wettkampfID === this.currentWettkampftagArray[i].id).forEach((kampfrichter) => this.kampfrichterTag[i].push(Object.assign({}, kampfrichter)));

      if (tempKampfrichter[0] !== undefined) {
        for (const iter of Object.keys(this.kampfrichterTag[i])) {
          this.initiallySelectedKampfrichterTag[i].push(this.allUserWithKampfrichterLizenz.filter((user) => user.id === this.kampfrichterTag[iter].id)[0]);
        }
      }

      this.initiallySelectedKampfrichterTag[i].forEach((val) => this.selectedKampfrichterTag[i].push(Object.assign({}, val)));
      tempNotSelectedKampfrichterTag = this.allUserWithKampfrichterLizenz.filter((user) => this.initiallySelectedKampfrichterTag[i].indexOf(user) < 0);

      this.notSelectedKampfrichterWettkampfTag[i] = tempNotSelectedKampfrichterTag;
    }

    this.loading = false;
  }

  private handleKampfrichterResponseArrayFailure(response: BogenligaResponse<KampfrichterDTO[]>): void {
    this.loading = false;
  }

  private loadDistinctWettkampf(): void {
    this.loadingWettkampf = true;
    this.wettkampfDataProvider.findAll()
        .then((newList: BogenligaResponse<WettkampfDO[]>) => this.handleLoadDistinctWettkampfSuccess(newList))
        .catch((newList: BogenligaResponse<WettkampfDTO[]>) => this.handleLoadDistinctWettkampfFailure(newList));
  }

  private handleLoadDistinctWettkampfSuccess(response: BogenligaResponse<WettkampfDO[]>): void {

    this.selectedDTOs = [];
    this.selectedDTOs = response.payload.filter(element => element.wettkampfVeranstaltungsId === this.currentVeranstaltung.id);

    if(this.selectedDTOs.length===0){
      //this.saveWettkaempfeNew(1);
      this.createInitWettkampfTag(1);
      this.selectedDTOs.push(new WettkampfDO());
      //this.selectedDTOs[0].wettkampfTag=1;
      console.log(this.selectedDTOs.toString());
      //this.loadDistinctWettkampf();
      this.loadWettkampf();
      this.loadDistinctWettkampf();
    }

    this.loadingWettkampf = false;
  }

  private handleLoadDistinctWettkampfFailure(response: BogenligaResponse<WettkampfDTO[]>): void {
    this.selectedDTOs = [];
    this.loadingWettkampf = false;
  }

  public onSelect($event: WettkampfDO[]): void {
    this.selectedWettkampfTag = $event[0].wettkampfTag;
    console.log('onSelect Dialog: ' + this.selectedWettkampfTag);
    this.loadWettkampf();
  }

  public createInitWettkampfTag(num: number): void {
    const temp: WettkampfDO = new WettkampfDO(
      num,
      this.currentVeranstaltung.id,
      "0000-00-00",
      "leer",
      "leer",
      "leer",
      "leer",
      "leer",
      this.currentWettkampftagArray.length-1,
      1,
      1,
      1,
      1
    );
    //this.currentWettkampftagArray[this.selectedWettkampfTag] = temp;
    this.saveWettkampftag(temp);
  }
}

