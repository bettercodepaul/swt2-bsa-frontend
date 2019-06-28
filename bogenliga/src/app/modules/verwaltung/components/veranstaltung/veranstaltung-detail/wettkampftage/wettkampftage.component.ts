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


  public currentUser: UserProfileDO = new UserProfileDO();
  public allUsers: Array<UserProfileDO> = [new UserProfileDO()];
  public allUsersTest: Array<UserProfileDO> = [new UserProfileDO()];

  public currentWettkampftag_1: WettkampfDO = new WettkampfDO();
  public currentWettkampftag_2: WettkampfDO = new WettkampfDO();
  public currentWettkampftag_3: WettkampfDO = new WettkampfDO();
  public currentWettkampftag_4: WettkampfDO = new WettkampfDO();
  public allWettkampf: Array<WettkampfDO> = [new WettkampfDO()];




  public deleteLoading = false;
  public saveLoading = false;

  public id;

  constructor(
      private veranstaltungDataProvider: VeranstaltungDataProviderService,
      private wettkampfDataProvider: WettkampfDataProviderService,
      private userProvider: UserProfileDataProviderService,
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



          this.loadUsers();


          this.loading = false;
          this.deleteLoading = false;
          this.saveLoading = false;
        } else {
          console.log("onINIt" );   console.log("onINIt" );   console.log("onINIt" );   console.log("onINIt" );   console.log("onINIt" );   console.log("onINIt" );
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


  public onUpdate(ignore: any): void {
    this.saveLoading = true;

    console.log("update wird aufgerufem");
    console.log("update wird aufgerufem");console.log("update wird aufgerufem");console.log("update wird aufgerufem");console.log("update wird aufgerufem");console.log("update wird aufgerufem");console.log("update wird aufgerufem");console.log("update wird aufgerufem");
    if (this.currentWettkampftag_1.id != null) {
        this.wettkampfDataProvider.update(this.currentWettkampftag_1)
          .then((response: BogenligaResponse<WettkampfDO>) => {
            if (!isNullOrUndefined(response)
              && !isNullOrUndefined(response.payload)
              && !isNullOrUndefined(response.payload.id)) {

              const id = this.currentWettkampftag_1.id;

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
            }
          }, (response: BogenligaResponse<VeranstaltungDO>) => {
            console.log('Failed');
            this.saveLoading = false;
          });

    } else if (this.currentWettkampftag_1 === null){
      this.currentWettkampftag_1.veranstaltungsId = this.currentVeranstaltung.id;
      this.currentWettkampftag_1.wettkampfTag = 1;

      this.wettkampfDataProvider.create(this.currentWettkampftag_1)
          .then((response: BogenligaResponse<WettkampfDO>) => {
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
          }, (response: BogenligaResponse<WettkampfDO>) => {
            console.log('Failed');
            this.saveLoading = false;
          });

    }

    if (this.currentWettkampftag_2.id != null) {
      this.wettkampfDataProvider.update(this.currentWettkampftag_2)
          .then((response: BogenligaResponse<WettkampfDO>) => {
            if (!isNullOrUndefined(response)
              && !isNullOrUndefined(response.payload)
              && !isNullOrUndefined(response.payload.id)) {

              const id = this.currentWettkampftag_2.id;

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
            }
          }, (response: BogenligaResponse<VeranstaltungDO>) => {
            console.log('Failed');
            this.saveLoading = false;
          });

    } else if (this.currentWettkampftag_2 === null){
      this.currentWettkampftag_2.veranstaltungsId = this.currentVeranstaltung.id;
      this.currentWettkampftag_2.wettkampfTag = 2;

      this.wettkampfDataProvider.create(this.currentWettkampftag_2)
          .then((response: BogenligaResponse<WettkampfDO>) => {
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
          }, (response: BogenligaResponse<WettkampfDO>) => {
            console.log('Failed');
            this.saveLoading = false;
          });

    }

    if (this.currentWettkampftag_3.id != null) {
      this.wettkampfDataProvider.update(this.currentWettkampftag_3)
          .then((response: BogenligaResponse<WettkampfDO>) => {
            if (!isNullOrUndefined(response)
              && !isNullOrUndefined(response.payload)
              && !isNullOrUndefined(response.payload.id)) {

              const id = this.currentWettkampftag_3.id;

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
            }
          }, (response: BogenligaResponse<VeranstaltungDO>) => {
            console.log('Failed');
            this.saveLoading = false;
          });

    } else if(this.currentWettkampftag_3 === null){
      this.currentWettkampftag_3.veranstaltungsId = this.currentVeranstaltung.id;
      this.currentWettkampftag_3.wettkampfTag = 3;

      this.wettkampfDataProvider.create(this.currentWettkampftag_3)
          .then((response: BogenligaResponse<WettkampfDO>) => {
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
          }, (response: BogenligaResponse<WettkampfDO>) => {
            console.log('Failed');
            this.saveLoading = false;
          });

    }

    if (this.currentWettkampftag_4.id != null) {
      this.wettkampfDataProvider.update(this.currentWettkampftag_4)
          .then((response: BogenligaResponse<WettkampfDO>) => {
            if (!isNullOrUndefined(response)
              && !isNullOrUndefined(response.payload)
              && !isNullOrUndefined(response.payload.id)) {

              const id = this.currentWettkampftag_4.id;

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
            }
          }, (response: BogenligaResponse<VeranstaltungDO>) => {
            console.log('Failed');
            this.saveLoading = false;
          });

    } else if(this.currentWettkampftag_4 === null) {
      this.currentWettkampftag_4.veranstaltungsId = this.currentVeranstaltung.id;
      this.currentWettkampftag_4.wettkampfTag = 4;

      this.wettkampfDataProvider.create(this.currentWettkampftag_4)
          .then((response: BogenligaResponse<WettkampfDO>) => {
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
          }, (response: BogenligaResponse<WettkampfDO>) => {
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

  private loadUsers() {
    this.userProvider.findAll()
        .then((response: BogenligaResponse<UserProfileDO[]>) => this.handleUserResponseArraySuccess(response))
        .catch((response: BogenligaResponse<UserProfileDTO[]>) => this.handleUserResponseArrayFailure(response));

  }



  private loadWettkampf() {
    console.log("load wettkamptag" ); console.log("load wettkamptag" ); console.log("load wettkamptag" ); console.log("load wettkamptag" ); console.log("load wettkamptag" );
    this.wettkampfDataProvider.findAll()
        .then((response: BogenligaResponse<WettkampfDO[]>) => this.handleWettkampfResponseArraySuccess(response))
        .catch((response: BogenligaResponse<WettkampfDTO[]>) => this.handleWettkampfResponseArrayFailure(response));

  }

  private handleSuccess(response: BogenligaResponse<VeranstaltungDO>) {
    this.currentVeranstaltung = response.payload;
    this.loading = false;
    this.loadUsers();
    this.loadWettkampf();

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


  private handleUserResponseArraySuccess(response: BogenligaResponse<UserProfileDO[]>): void {
    this.allUsers = [];
    this.allUsers = response.payload;
    if (this.id === 'add') {
      this.currentUser = this.allUsers[0];
    } else {
      this.currentUser = this.allUsers.filter((user) => user.id === this.currentVeranstaltung.ligaleiterID)[0];
    }
    this.loading = false;
  }

  private handleUserResponseArrayFailure(response: BogenligaResponse<UserProfileDTO[]>): void {
    this.allUsers = [];
    this.loading = false;
  }

  private handleWettkampfResponseArraySuccess(response: BogenligaResponse<WettkampfDO[]>): void {
    this.allWettkampf = [];
    this.allWettkampf = response.payload;
    this.allWettkampf = this.allWettkampf.filter((wettkampf) => wettkampf.veranstaltungsId === this.currentVeranstaltung.id);
    console.log(this.currentVeranstaltung.id + " blablabla id " + this.allWettkampf.toString()); console.log(this.currentVeranstaltung.id + " blablabla id " + this.allWettkampf.toString()); console.log(this.currentVeranstaltung.id + " blablabla id " + this.allWettkampf.toString()); console.log(this.currentVeranstaltung.id + " blablabla id " + this.allWettkampf.toString());
    console.log(this.allWettkampf.length);  console.log(this.allWettkampf.length); console.log(this.allWettkampf.length); console.log(this.allWettkampf.length); console.log(this.allWettkampf.length);

  if( this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 1).length === 0){
    this.currentWettkampftag_1 = null;
    console.log("wettkamptag 1 null"); console.log("wettkamptag 1 null"); console.log("wettkamptag 1 null"); console.log("wettkamptag 1 null"); console.log("wettkamptag 1 null"); console.log("wettkamptag 1 null");
  }else{
    this.currentWettkampftag_1 = this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 1)[0];
    console.log("wettkamptag 1  not null"); console.log("wettkamptag 1  not null");console.log("wettkamptag 1  not null");console.log("wettkamptag 1  not null");
  }

  if(this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 2).length === 0){
    this.currentWettkampftag_2 = null;
    console.log("wettkamptag 2 null");
  }else{
    this.currentWettkampftag_2 = this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 2)[0];
    console.log("wettkamptag 2  not null");
  }

  if(this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 3).length === 0){
    this.currentWettkampftag_3 = null;
  }else{
    this.currentWettkampftag_3 = this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 3)[0];
  }

  if(this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 4).length === 0){
    this.currentWettkampftag_4 = null;
  }else{
    this.currentWettkampftag_4 = this.allWettkampf.filter((wettkampf) => wettkampf.wettkampfTag === 4)[0];
  }



    this.loading = false;
  }

  private handleWettkampfResponseArrayFailure(response: BogenligaResponse<WettkampfDTO[]>): void {
    this.allWettkampf = [];
    this.loading = false;
  }
}
