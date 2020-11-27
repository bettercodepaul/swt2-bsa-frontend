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


const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_VERANSTALTUNG = 'veranstaltung_detail_delete';
const NOTIFICATION_DELETE_VERANSTALTUNG_SUCCESS = 'veranstaltung_detail_delete_success';
const NOTIFICATION_DELETE_VERANSTALTUNG_FAILURE = 'veranstaltung_detail_delete_failure';
const NOTIFICATION_SAVE_VERANSTALTUNG = 'veranstaltung_detail_save';
const NOTIFICATION_UPDATE_VERANSTALTUNG = 'veranstaltung_detail_update';

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
  public allUsersTag1: Array<BenutzerRolleDO> = [];
  public allUsersTag2: Array<BenutzerRolleDO> = [];
  public allUsersTag3: Array<BenutzerRolleDO> = [];
  public allUsersTag4: Array<BenutzerRolleDO> = [];

  public selectedKampfrichterTag1: Array<BenutzerRolleDO> = [];
  public selectedKampfrichterTag2: Array<BenutzerRolleDO> = [];
  public selectedKampfrichterTag3: Array<BenutzerRolleDO> = [];
  public selectedKampfrichterTag4: Array<BenutzerRolleDO> = [];

  public allKampfrichter: Array<KampfrichterDO> = [];
  public KampfrichterTag1: Array<KampfrichterDO> = [];
  public KampfrichterTag2: Array<KampfrichterDO> = [];
  public KampfrichterTag3: Array<KampfrichterDO> = [];
  public KampfrichterTag4: Array<KampfrichterDO> = [];

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

  constructor(
    private veranstaltungDataProvider: VeranstaltungDataProviderService,
    private wettkampfDataProvider: WettkampfDataProviderService,
    private userProvider: UserProfileDataProviderService,
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
    // this.currentWettkampftag_1.wettkampfAusrichter is null?
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


  public onSaveWettkampfTag1(ignore: any): void {
    this.currentWettkampftag_1.wettkampfVeranstaltungsId = this.currentVeranstaltung.id;
    this.currentWettkampftag_1.wettkampfTag = 1;
    this.currentWettkampftag_1.wettkampfDisziplinId = 0;
    this.currentWettkampftag_1.wettkampfTypId = this.currentVeranstaltung.wettkampfTypId;

    this.currentWettkampftag_1.kampfrichterID = this.selectedKampfrichterTag1[0].id;
    console.log('==>onSaveWettkampfTag1: Selected kampfrichter-ID: ' + this.currentWettkampftag_1.kampfrichterID);

    this.currentWettkampftag_1.wettkampfAusrichter = this.currentAusrichter1.id;
    if (this.currentWettkampftag_1.id == null) {
      // die Daten sind initial angelegt - es exitsiert noch keine ID --> Save nicht update
      this.currentWettkampftag_1.id = this.saveWettkampftag(this.currentWettkampftag_1);
    } else {
      this.updateWettkampftag(this.currentWettkampftag_1);
    }
  }


  public onSaveWettkampfTag2(ignore: any): void {
    this.currentWettkampftag_2.wettkampfVeranstaltungsId = this.currentVeranstaltung.id;
    this.currentWettkampftag_2.wettkampfTag = 2;
    this.currentWettkampftag_2.wettkampfDisziplinId = 0;
    this.currentWettkampftag_2.wettkampfTypId = this.currentVeranstaltung.wettkampfTypId;
    this.currentWettkampftag_2.kampfrichterID = this.selectedKampfrichterTag2[0].id;
    console.log('Selected kampfrichter-ID: ' + this.currentWettkampftag_2.kampfrichterID);
    this.currentWettkampftag_2.wettkampfAusrichter = this.currentAusrichter2.id;
    if (this.currentWettkampftag_2.id == null) {
      // die Daten sind initial angelegt - es exitsiert noch keine ID --> Save nicht update
      this.currentWettkampftag_2.id = this.saveWettkampftag(this.currentWettkampftag_2);
    } else {
      this.updateWettkampftag(this.currentWettkampftag_2);
    }

  }

  public onSaveWettkampfTag3(ignore: any): void {
    this.currentWettkampftag_3.wettkampfVeranstaltungsId = this.currentVeranstaltung.id;
    this.currentWettkampftag_3.wettkampfTag = 3;
    this.currentWettkampftag_3.wettkampfDisziplinId = 0;
    this.currentWettkampftag_3.wettkampfTypId = this.currentVeranstaltung.wettkampfTypId;
    this.currentWettkampftag_3.kampfrichterID = this.selectedKampfrichterTag3[0].id;
    console.log('Selected kampfrichter-ID: ' + this.currentWettkampftag_3.kampfrichterID);
    this.currentWettkampftag_3.wettkampfAusrichter = this.currentAusrichter3.id;
    if (this.currentWettkampftag_3.id == null) {
      // die Daten sind initial angelegt - es exitsiert noch keine ID --> Save nicht update
      this.currentWettkampftag_3.id = this.saveWettkampftag(this.currentWettkampftag_3);
    } else {
      this.updateWettkampftag(this.currentWettkampftag_3);
    }
  }

  public onSaveWettkampfTag4(ignore: any): void {
    this.currentWettkampftag_4.wettkampfVeranstaltungsId = this.currentVeranstaltung.id;
    this.currentWettkampftag_4.wettkampfTag = 4;
    this.currentWettkampftag_4.wettkampfDisziplinId = 0;
    this.currentWettkampftag_4.wettkampfTypId = this.currentVeranstaltung.wettkampfTypId;
    this.currentWettkampftag_4.kampfrichterID = this.selectedKampfrichterTag4[0].id;
    console.log('Selected kampfrichter-ID: ' + this.currentWettkampftag_4.kampfrichterID);
    this.currentWettkampftag_4.wettkampfAusrichter = this.currentAusrichter4.id;
    if (this.currentWettkampftag_4.id == null) {
      // die Daten sind initial angelegt - es exitsiert noch keine ID --> Save nicht update
      this.currentWettkampftag_4.id = this.saveWettkampftag(this.currentWettkampftag_4);
    } else {
      this.updateWettkampftag(this.currentWettkampftag_4);
    }
  }

  private saveWettkampftag(wettkampfDO: WettkampfDO): number {

    this.wettkampfDataProvider.create(wettkampfDO)
        .then((response: BogenligaResponse<WettkampfDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            wettkampfDO.id = response.payload.id;
            console.log(wettkampfDO);
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
        }, (response: BogenligaResponse<WettkampfDO>) => {
          console.log('Failed');
          this.saveLoading = false;
        });

    return wettkampfDO.id;
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

            this.notificationService.observeNotification(NOTIFICATION_SAVE_VERANSTALTUNG)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/veranstaltung/' + this.currentVeranstaltung.id + '/' + this.currentVeranstaltung.id);
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: BogenligaResponse<WettkampfDO>) => {
          console.log('Failed');
          this.saveLoading = false;
        });
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


  private loadBenutzer() {
    this.benutzerRolleProvider.findAll()
        .then((response: BogenligaResponse<BenutzerRolleDO[]>) => this.handleBenutzerrolleResponseArraySuccess(response))
        .catch((response: BogenligaResponse<BenutzerRolleDTO[]>) => this.handleBenutzerrolleResponseArrayFailure(response));
  }

  private loadKampfrichter() {
    this.kampfrichterProvider.findAll()
        .then((response: BogenligaResponse<KampfrichterDO[]>) => this.handleKampfrichterResponseArraySuccess(response))
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
    this.loadBenutzer();
    this.loadKampfrichter();

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
      console.log('==> handleWettkampfResponseArraySuccess: wettkampfTag 1 existiert schon...');

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
    this.allUsersTag1 = [];
    this.allUsersTag2 = [];
    this.allUsersTag3 = [];
    this.allUsersTag4 = [];
    this.loading = false;
  }

  private handleBenutzerrolleResponseArraySuccess(response: BogenligaResponse<BenutzerRolleDO[]>): void {
    this.allUsersTag1 = [];
    this.allUsersTag2 = [];
    this.allUsersTag3 = [];
    this.allUsersTag4 = [];
    this.allUsersTag1 = response.payload;
    this.allUsersTag2 = response.payload;
    this.allUsersTag3 = response.payload;
    this.allUsersTag4 = response.payload;
    this.allUsersTag1 = this.allUsersTag1.filter((user) => user.roleId === 5);
    this.allUsersTag2 = this.allUsersTag2.filter((user) => user.roleId === 5);
    this.allUsersTag3 = this.allUsersTag3.filter((user) => user.roleId === 5);
    this.allUsersTag4 = this.allUsersTag4.filter((user) => user.roleId === 5);

    this.loading = false;
  }

  private handleBenutzerrolleResponseArrayFailure(response: BogenligaResponse<BenutzerRolleDTO[]>): void {
    this.allUsersTag1 = [];
    this.allUsersTag2 = [];
    this.allUsersTag3 = [];
    this.allUsersTag4 = [];
    this.loading = false;
  }

  // TODO: Fix this method
  private handleKampfrichterResponseArraySuccess(response: BogenligaResponse<KampfrichterDO[]>): void {

    this.allKampfrichter = [];
    this.allKampfrichter = response.payload;

    console.log('==> handleKampfrichterResponseArraySuccess: allKampfrichter-ID: ' + this.allKampfrichter[0].id);
    console.log('==> handleKampfrichterResponseArraySuccess: KampfrichterTag1-ID: ' + this.KampfrichterTag1[0]);
    console.log(' ==> response.payload: ' + response.result);

    this.KampfrichterTag1 = this.allKampfrichter.filter((kampfrichter) => kampfrichter.wettkampfID === this.currentWettkampftag_1.id);
    for (const iter of Object.keys(this.KampfrichterTag1)) {
      this.selectedKampfrichterTag1.push(this.allUsersTag1.filter((user) => user.id === this.KampfrichterTag1[iter].userid)[0]);
    }

    console.log('==> handleKampfrichterResponseArraySuccess: KampfrichterTag1-ID: ' + this.KampfrichterTag1[0]);
    this.KampfrichterTag2 = this.allKampfrichter.filter((kampfrichter) => kampfrichter.wettkampfID === this.currentWettkampftag_2.id);
    for (const iter of Object.keys(this.KampfrichterTag2)) {
      this.selectedKampfrichterTag2.push(this.allUsersTag2.filter((user) => user.id === this.KampfrichterTag2[iter].userid)[0]);
    }
    this.KampfrichterTag3 = this.allKampfrichter.filter((kampfrichter) => kampfrichter.wettkampfID === this.currentWettkampftag_3.id);
    for (const iter of Object.keys(this.KampfrichterTag3)) {
      this.selectedKampfrichterTag3.push(this.allUsersTag3.filter((user) => user.id === this.KampfrichterTag3[iter].userid)[0]);
    }
    this.KampfrichterTag4 = this.allKampfrichter.filter((kampfrichter) => kampfrichter.wettkampfID === this.currentWettkampftag_4.id);
    for (const iter of Object.keys(this.KampfrichterTag4)) {
      this.selectedKampfrichterTag4.push(this.allUsersTag4.filter((user) => user.id === this.KampfrichterTag4[iter].userid)[0]);
    }
    console.log('==> handleKampfrichterResponseArraySuccess: allKampfrichter-ID v2: ' + this.allKampfrichter[0].id);

    this.loading = false;
  }

  private handleKampfrichterResponseArrayFailure(response: BogenligaResponse<KampfrichterDTO[]>): void {
    this.allKampfrichter = [];
    this.loading = false;
  }
}
