import {Component, NgModule, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonComponent} from '@shared/components';
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
import {UserProfileDataProviderService} from '../../../../../user/services/user-profile-data-provider.service';
import {UserProfileDTO} from '../../../../../user/types/model/user-profile-dto.class';
import {UserProfileDO} from '../../../../../user/types/user-profile-do.class';
import {VeranstaltungDataProviderService} from '../../../../services/veranstaltung-data-provider.service';
import {VeranstaltungDTO} from '../../../../types/datatransfer/veranstaltung-dto.class';
import {VeranstaltungDO} from '../../../../types/veranstaltung-do.class';
import {WETTKMAPFTAGE_CONFIG} from './wettkampftage.config';
import {WettkampfDO} from '../../../../../verwaltung/types/wettkampf-do.class';
import {WettkampfDTO} from '../../../../../verwaltung/types/datatransfer/wettkampf-dto.class';
import {WettkampfDataProviderService} from '../../../../services/wettkampf-data-provider.service';
import {BenutzerRolleDO} from '../../../../../verwaltung/types/benutzer-rolle-do.class';
import {BenutzerRolleDTO} from '../../../../../verwaltung/types/datatransfer/benutzer-rolle-dto.class';
import {BenutzerDataProviderService} from '../../../../services/benutzer-data-provider.service';
import {KampfrichterDO} from '../../../../../verwaltung/types/kampfrichter-do.class';
import {KampfrichterDTO} from '../../../../../verwaltung/types/datatransfer/kampfrichter-dto.class';
import {KampfrichterProviderService} from '../../../../services/kampfrichter-data-provider.service';

const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_VERANSTALTUNG = 'veranstaltung_detail_delete';
const NOTIFICATION_DELETE_VERANSTALTUNG_SUCCESS = 'veranstaltung_detail_delete_success';
const NOTIFICATION_DELETE_VERANSTALTUNG_FAILURE = 'veranstaltung_detail_delete_failure';
const NOTIFICATION_SAVE_VERANSTALTUNG = 'veranstaltung_detail_save';
const NOTIFICATION_UPDATE_VERANSTALTUNG = 'veranstaltung_detail_update';


@Component({
  selector:    'bla-wettkampftage',
  templateUrl: './wettkampftage.component.html',
  styleUrls:   ['./wettkampftage.component.scss']
})

export class WettkampftageComponent extends CommonComponent implements OnInit {
  public config = WETTKMAPFTAGE_CONFIG;
  public ButtonType = ButtonType;

  public currentVeranstaltung: VeranstaltungDO = new VeranstaltungDO();


  public currentUser: UserProfileDO;
  public allUsers: Array<BenutzerRolleDO> = [];

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


  public deleteLoading = false;
  public saveLoading = false;

  public id;

  constructor(
    private veranstaltungDataProvider: VeranstaltungDataProviderService,
    private wettkampfDataProvider: WettkampfDataProviderService,
    private userProvider: UserProfileDataProviderService,
    private benutzerrolleProvider: BenutzerDataProviderService,
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
        }
      }
    });
  }

  public onVeranstaltungDetail(ignore: any): void {
    this.navigateToWettkampftage(this.currentVeranstaltung);
  }

  private navigateToWettkampftage(ignore: any) {
    this.router.navigateByUrl('/verwaltung/veranstaltung/' + this.currentVeranstaltung.id);
  }


  public onSaveWettkampTag1(ignore: any): void {
    this.currentWettkampftag_1.wettkampfVeranstaltungsId = this.currentVeranstaltung.id;
    this.currentWettkampftag_1.wettkampfTag = 1;
    this.currentWettkampftag_1.wettkampfDisziplinId = 0;
    this.currentWettkampftag_1.wettkampfTypId = this.currentVeranstaltung.wettkampfTypId;

    this.wettkampfDataProvider.create(this.currentWettkampftag_1)
        .then((response: BogenligaResponse<WettkampfDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

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

  }

  public onUpdateWettkampTag1(ignore: any): void {

    this.wettkampfDataProvider.update(this.currentWettkampftag_1)
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


  public onSaveWettkampTag2(ignore: any): void {
    this.currentWettkampftag_2.wettkampfVeranstaltungsId = this.currentVeranstaltung.id;
    this.currentWettkampftag_2.wettkampfTag = 2;
    this.currentWettkampftag_2.wettkampfDisziplinId = 0;
    this.currentWettkampftag_2.wettkampfTypId = this.currentVeranstaltung.wettkampfTypId;

    this.wettkampfDataProvider.create(this.currentWettkampftag_1)
        .then((response: BogenligaResponse<WettkampfDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            const notification: Notification = {
              id:          NOTIFICATION_SAVE_VERANSTALTUNG,
              title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG2.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG2.NOTIFICATION.SAVE.DESCRIPTION',
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

  public onUpdateWettkampTag2(ignore: any): void {

    this.wettkampfDataProvider.update(this.currentWettkampftag_2)
        .then((response: BogenligaResponse<WettkampfDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            const notification: Notification = {
              id:          NOTIFICATION_SAVE_VERANSTALTUNG,
              title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG2.NOTIFICATION.UPDATE.TITLE',
              description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG2.NOTIFICATION.UPDATE.DESCRIPTION',
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

  public onSaveWettkampTag3(ignore: any): void {
    this.currentWettkampftag_3.wettkampfVeranstaltungsId = this.currentVeranstaltung.id;
    this.currentWettkampftag_3.wettkampfTag = 1;
    this.currentWettkampftag_3.wettkampfDisziplinId = 0;
    this.currentWettkampftag_3.wettkampfTypId = this.currentVeranstaltung.wettkampfTypId;

    this.wettkampfDataProvider.create(this.currentWettkampftag_1)
        .then((response: BogenligaResponse<WettkampfDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            const notification: Notification = {
              id:          NOTIFICATION_SAVE_VERANSTALTUNG,
              title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG3.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG3.NOTIFICATION.SAVE.DESCRIPTION',
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

  public onUpdateWettkampTag3(ignore: any): void {

    this.wettkampfDataProvider.update(this.currentWettkampftag_3)
        .then((response: BogenligaResponse<WettkampfDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            const notification: Notification = {
              id:          NOTIFICATION_SAVE_VERANSTALTUNG,
              title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG3.NOTIFICATION.UPDATE.TITLE',
              description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG3.NOTIFICATION.UPDATE.DESCRIPTION',
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

  public onSaveWettkampTag4(ignore: any): void {
    this.currentWettkampftag_4.wettkampfVeranstaltungsId = this.currentVeranstaltung.id;
    this.currentWettkampftag_4.wettkampfTag = 4;
    this.currentWettkampftag_4.wettkampfDisziplinId = 0;
    this.currentWettkampftag_4.wettkampfTypId = this.currentVeranstaltung.wettkampfTypId;

    this.wettkampfDataProvider.create(this.currentWettkampftag_1)
        .then((response: BogenligaResponse<WettkampfDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            const notification: Notification = {
              id:          NOTIFICATION_SAVE_VERANSTALTUNG,
              title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG4.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG4.NOTIFICATION.SAVE.DESCRIPTION',
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

  public onUpdateWettkampTag4(ignore: any): void {

    this.wettkampfDataProvider.update(this.currentWettkampftag_4)
        .then((response: BogenligaResponse<WettkampfDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            const notification: Notification = {
              id:          NOTIFICATION_SAVE_VERANSTALTUNG,
              title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG4.NOTIFICATION.UPDATE.TITLE',
              description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.FORM.WETTKAMPFTAG4.NOTIFICATION.UPDATE.DESCRIPTION',
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
    this.benutzerrolleProvider.findAll()
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
        .catch((response: BogenligaResponse<WettkampfDTO[]>) => this.handleWettkampfResponseArrayFailure(response));

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
      ;

    } else {
      this.currentWettkampftag_1 = this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 1)[0];

    }

    if (this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 2).length === 0) {
      this.currentWettkampftag_2 = new WettkampfDO();
      ;

    } else {
      this.currentWettkampftag_2 = this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 2)[0];

    }

    if (this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 3).length === 0) {
      this.currentWettkampftag_3 = new WettkampfDO();
      ;
    } else {
      this.currentWettkampftag_3 = this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 3)[0];
    }

    if (this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 4).length === 0) {
      this.currentWettkampftag_4 = new WettkampfDO();
      ;
    } else {
      this.currentWettkampftag_4 = this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 4)[0];
    }


    this.loading = false;
  }

  private handleWettkampfResponseArrayFailure(response: BogenligaResponse<WettkampfDTO[]>): void {
    this.allUsers = [];
    this.loading = false;
  }

  private handleBenutzerrolleResponseArraySuccess(response: BogenligaResponse<BenutzerRolleDO[]>): void {
    this.allUsers = [];
    this.allUsers = response.payload;
    this.allUsers = this.allUsers.filter((user) => user.roleId === 5);
    this.loading = false;
  }

  private handleBenutzerrolleResponseArrayFailure(response: BogenligaResponse<BenutzerRolleDTO[]>): void {
    this.allUsers = [];
    this.loading = false;
  }

  private handleKampfrichterResponseArraySuccess(response: BogenligaResponse<KampfrichterDO[]>): void {

    this.allKampfrichter = [];
    this.allKampfrichter = response.payload;

    this.KampfrichterTag1 = this.allKampfrichter.filter((kampfrichter) => kampfrichter.id===this.currentWettkampftag_1.id);
    for(let iter in this.KampfrichterTag1) {
      this.selectedKampfrichterTag1.push(this.allUsers.filter((user) => user.id === this.KampfrichterTag1[iter].userid)[0]);
    }
    this.KampfrichterTag2 = this.allKampfrichter.filter((kampfrichter) => kampfrichter.id===this.currentWettkampftag_2.id);
    for(let iter in this.KampfrichterTag2) {
      this.selectedKampfrichterTag2.push(this.allUsers.filter((user) => user.id === this.KampfrichterTag2[iter].userid)[0]);
    }
    this.KampfrichterTag3 = this.allKampfrichter.filter((kampfrichter) => kampfrichter.id===this.currentWettkampftag_3.id);
    for(let iter in this.KampfrichterTag3) {
      this.selectedKampfrichterTag3.push(this.allUsers.filter((user) => user.id === this.KampfrichterTag3[iter].userid)[0]);
    }
    this.KampfrichterTag4 = this.allKampfrichter.filter((kampfrichter) => kampfrichter.id===this.currentWettkampftag_4.id);
    for(let iter in this.KampfrichterTag4) {
      this.selectedKampfrichterTag4.push(this.allUsers.filter((user) => user.id === this.KampfrichterTag4[iter].userid)[0]);
    }
    this.loading = false;
  }

  private handleKampfrichterResponseArrayFailure(response: BogenligaResponse<KampfrichterDTO[]>): void {
    this.allKampfrichter = [];
    this.loading = false;
  }
}
