import {Component, OnInit} from '@angular/core';
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
} from '../../../../shared/services/notification';
import {UserProfileDataProviderService} from '../../../../user/services/user-profile-data-provider.service';
import {UserProfileDTO} from '../../../../user/types/model/user-profile-dto.class';
import {UserProfileDO} from '../../../../user/types/user-profile-do.class';
import {VeranstaltungDataProviderService} from '../../../services/veranstaltung-data-provider.service';
import {RegionDataProviderService} from '../../../services/region-data-provider.service';
import {VeranstaltungDTO} from '../../../types/datatransfer/veranstaltung-dto.class';
import {RegionDTO} from '../../../types/datatransfer/region-dto.class';
import {VeranstaltungDO} from '../../../types/veranstaltung-do.class';
import {RegionDO} from '../../../types/region-do.class';
import {VERANSTALTUNG_DETAIL_CONFIG} from './veranstaltung-detail.config';

const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_VERANSTALTUNG = 'veranstaltung_detail_delete';
const NOTIFICATION_DELETE_VERANSTALTUNG_SUCCESS = 'veranstaltung_detail_delete_success';
const NOTIFICATION_DELETE_VERANSTALTUNG_FAILURE = 'veranstaltung_detail_delete_failure';
const NOTIFICATION_SAVE_VERANSTALTUNG = 'veranstaltung_detail_save';
const NOTIFICATION_UPDATE_VERANSTALTUNG = 'veranstaltung_detail_update';

@Component({
  selector:    'bla-veranstaltung-detail',
  templateUrl: './veranstaltung-detail.component.html',
  styleUrls:   ['./veranstaltung-detail.component.scss']
})
export class VeranstaltungDetailComponent extends CommonComponent implements OnInit {
  public config = VERANSTALTUNG_DETAIL_CONFIG;
  public ButtonType = ButtonType;
  public currentVeranstaltung: VeranstaltungDO = new VeranstaltungDO();

  public currentUbergeordneteVeranstaltung: VeranstaltungDO = new VeranstaltungDO();
  public allUebergeordnete: Array<VeranstaltungDO> = [new VeranstaltungDO()];


  public currentUser: UserProfileDO = new UserProfileDO();
  public allUsers: Array<UserProfileDO> = [new UserProfileDO()];

  public deleteLoading = false;
  public saveLoading = false;

  public id;

  constructor(private veranstaltungDataProvider: VeranstaltungDataProviderService,
    private regionProvider: RegionDataProviderService,
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

          this.loadUebergeordnete(); // additional Request for all 'veranstaltung' to get all uebergeordnete

          this.loadUsers();

          this.loading = false;
          this.deleteLoading = false;
          this.saveLoading = false;
        } else {
          this.loadById(params[ID_PATH_PARAM]);
        }
      }
    });
  }

  public onSave(ignore: any): void {
    this.saveLoading = true;


    /*if (typeof this.currentVeranstaltung === 'undefined') {
      this.currentVeranstaltung.id = null;
    } else {
      this.currentVeranstaltung.id = this.currentVeranstaltung.id;
    }*/



    if (typeof this.currentUser === 'undefined') {
      this.currentVeranstaltung.ligaLeiterId = null;
    } else {
      this.currentVeranstaltung.ligaLeiterId = this.currentUser.id;
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

  public onUpdate(ignore: any): void {
    this.saveLoading = true;
   // this.currentVeranstaltung.veranstaltungUebergeordnetId = this.currentUbergeordneteVeranstaltung.id;
    this.currentVeranstaltung.ligaLeiterId = this.currentUser.id;
    // persist
    this.veranstaltungDataProvider.update(this.currentVeranstaltung)
        .then((response: BogenligaResponse<VeranstaltungDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {

            const id = this.currentVeranstaltung.id;

            const notification: Notification = {
              id:          NOTIFICATION_UPDATE_VERANSTALTUNG + id,
              title:       'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.VERANSTALTUNG_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
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



  private loadUebergeordnete() {
    this.veranstaltungDataProvider.findAll()
        .then((response: BogenligaResponse<VeranstaltungDO[]>) => this.handlUebergeordnetResponseArraySuccess(response))
        .catch((response: BogenligaResponse<VeranstaltungDTO[]>) => this.handleUebergeordnetResponseArrayFailure(response));
  }

  private loadUsers() {
    this.userProvider.findAll()
        .then((response: BogenligaResponse<UserProfileDO[]>) => this.handleUserResponseArraySuccess(response))
        .catch((response: BogenligaResponse<UserProfileDTO[]>) => this.handleUserResponseArrayFailure(response));

  }

  private handleSuccess(response: BogenligaResponse<VeranstaltungDO>) {
    this.currentVeranstaltung = response.payload;
    this.loading = false;

    this.loadUebergeordnete(); // additional Request for all 'veranstaltung' to get all uebergeordnete

    this.loadUsers();
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

 /* private handleResponseArraySuccess(response: BogenligaResponse<RegionDO[]>): void {
    this.regionen = [];
    this.regionen = response.payload;
    if (this.id === 'add') {
      this.currentRegion = this.regionen[0];
    } else {
      this.currentRegion = this.regionen.filter((region) => region.id === this.currentVeranstaltung.regionId)[0];
    }
    this.loading = false;
  }

  private handleResponseArrayFailure(response: BogenligaResponse<RegionDTO[]>): void {
    this.regionen = [];
    this.loading = false;
  }*/

  private handlUebergeordnetResponseArraySuccess(response: BogenligaResponse<VeranstaltungDO[]>): void {
    this.allUebergeordnete = [];
    this.allUebergeordnete = response.payload;
    if (this.id === 'add') {
      this.currentUbergeordneteVeranstaltung = this.allUebergeordnete[0];
    } else {
     // this.currentUbergeordneteVeranstaltung = this.allUebergeordnete.filter((uebergeordnet) => uebergeordnet.id === this.currentVeranstaltung.veranstaltungUebergeordnetId)[0];
    }
    this.loading = false;
  }

  private handleUebergeordnetResponseArrayFailure(response: BogenligaResponse<VeranstaltungDTO[]>): void {
    this.allUebergeordnete = [];
    this.loading = false;
  }

  private handleUserResponseArraySuccess(response: BogenligaResponse<UserProfileDO[]>): void {
    this.allUsers = [];
    this.allUsers = response.payload;
    if (this.id === 'add') {
      this.currentUser = this.allUsers[0];
    } else {
      this.currentUser = this.allUsers.filter((user) => user.id === this.currentVeranstaltung.ligaLeiterId)[0];
    }
    this.loading = false;
  }

  private handleUserResponseArrayFailure(response: BogenligaResponse<UserProfileDTO[]>): void {
    this.allUsers = [];
    this.loading = false;
  }
}
