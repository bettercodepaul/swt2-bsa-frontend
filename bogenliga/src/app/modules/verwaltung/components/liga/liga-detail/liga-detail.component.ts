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
import {LigaDataProviderService} from '../../../services/liga-data-provider.service';
import {RegionDataProviderService} from '../../../services/region-data-provider.service';
import {LigaDTO} from '../../../types/datatransfer/liga-dto.class';
import {RegionDTO} from '../../../types/datatransfer/region-dto.class';
import {LigaDO} from '../../../types/liga-do.class';
import {RegionDO} from '../../../types/region-do.class';
import {LIGA_DETAIL_CONFIG} from './liga-detail.config';

const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_LIGA = 'liga_detail_delete';
const NOTIFICATION_DELETE_LIGA_SUCCESS = 'liga_detail_delete_success';
const NOTIFICATION_DELETE_LIGA_FAILURE = 'liga_detail_delete_failure';
const NOTIFICATION_SAVE_LIGA = 'liga_detail_save';
const NOTIFICATION_UPDATE_LIGA = 'liga_detail_update';

@Component({
  selector: 'bla-liga-detail',
  templateUrl: './liga-detail.component.html',
  styleUrls: ['./liga-detail.component.scss']
})
export class LigaDetailComponent extends CommonComponent implements OnInit {
  public config = LIGA_DETAIL_CONFIG;
  public ButtonType = ButtonType;
  public currentLiga: LigaDO = new LigaDO();

  public currentUbergeordneteLiga: LigaDO = new LigaDO();
  public allUebergeordnete: Array<LigaDO> = [new LigaDO()];

  public currentRegion: RegionDO = new RegionDO();
  public regionen: Array<RegionDO> = [new RegionDO()];

  public currentUser: UserProfileDO = new UserProfileDO();
  public allUsers: Array<UserProfileDO> = [new UserProfileDO()];

  public deleteLoading = false;
  public saveLoading = false;

  public id;

  constructor(private ligaDataProvider: LigaDataProviderService,
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
          this.currentLiga = new LigaDO();

          this.loadUebergeordnete(); // additional Request for all 'liga' to get all uebergeordnete
          this.loadRegions(); // Request all regions from backend
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


    if (typeof this.currentUbergeordneteLiga === 'undefined') {
      this.currentLiga.ligaUebergeordnetId = null;
    } else {
      this.currentLiga.ligaUebergeordnetId = this.currentUbergeordneteLiga.id;
    }

    if (typeof this.currentRegion  === 'undefined') {
      this.currentLiga.regionId = null;
    } else {
      this.currentLiga.regionId = this.currentRegion.id;
    }

    if (typeof this.currentUser  === 'undefined') {
      this.currentLiga.ligaVerantwortlichId = null;
    } else {
      this.currentLiga.ligaVerantwortlichId = this.currentUser.id;
    }

    // persist
    this.ligaDataProvider.create(this.currentLiga)
        .then((response: BogenligaResponse<LigaDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            const notification: Notification = {
              id:          NOTIFICATION_SAVE_LIGA,
              title:       'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_SAVE_LIGA)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/liga');
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: BogenligaResponse<LigaDO>) => {
          console.log('Failed');
          this.saveLoading = false;


        });
    // show response message
  }

  public onUpdate(ignore: any): void {
    this.saveLoading = true;
    this.currentLiga.regionId = this.currentRegion.id;
    this.currentLiga.ligaUebergeordnetId = this.currentUbergeordneteLiga.id;
    this.currentLiga.ligaVerantwortlichId = this.currentUser.id;
    // persist
    this.ligaDataProvider.update(this.currentLiga)
        .then((response: BogenligaResponse<LigaDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {

            const id = this.currentLiga.id;

            const notification: Notification = {
              id:          NOTIFICATION_UPDATE_LIGA + id,
              title:       'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_UPDATE_LIGA + id)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/liga');
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: BogenligaResponse<LigaDO>) => {
          console.log('Failed');
          this.saveLoading = false;
        });
  }

  public onDelete(ignore: any): void {
    this.deleteLoading = true;
    this.notificationService.discardNotification();

    const id = this.currentLiga.id;

    const notification: Notification = {
      id:               NOTIFICATION_DELETE_LIGA + id,
      title:            'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_LIGA + id)
        .subscribe((myNotification) => {

          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.ligaDataProvider.deleteById(id)
                .then((response) => this.handleDeleteSuccess(response))
                .catch((response) => this.handleDeleteFailure(response));
          }
        });

    this.notificationService.showNotification(notification);
  }

  public entityExists(): boolean {
    return this.currentLiga.id >= 0;
  }

  private loadById(id: number) {
    this.ligaDataProvider.findById(id)
        .then((response: BogenligaResponse<LigaDO>) => this.handleSuccess(response))
        .catch((response: BogenligaResponse<LigaDO>) => this.handleFailure(response));
  }

  private loadRegions() {
    this.regionProvider.findAll()
      .then((response: BogenligaResponse<RegionDO[]>) => this.handleResponseArraySuccess(response))
      .catch((response: BogenligaResponse<RegionDTO[]>) => this.handleResponseArrayFailure(response));
  }

  private loadUebergeordnete() {
    this.ligaDataProvider.findAll()
      .then((response: BogenligaResponse<LigaDO[]>) => this.handlUebergeordnetResponseArraySuccess (response))
      .catch((response: BogenligaResponse<LigaDTO[]>) => this.handleUebergeordnetResponseArrayFailure (response));
  }

  private loadUsers() {
    this.userProvider.findAll()
        .then( (response: BogenligaResponse<UserProfileDO[]>) => this.handleUserResponseArraySuccess (response))
        .catch((response: BogenligaResponse<UserProfileDTO[]>) => this.handleUserResponseArrayFailure (response));

  }

  private handleSuccess(response: BogenligaResponse<LigaDO>) {
    this.currentLiga = response.payload;
    this.loading = false;

    this.loadUebergeordnete(); // additional Request for all 'liga' to get all uebergeordnete
    this.loadRegions(); // Request all regions from backend
    this.loadUsers();
  }

  private handleFailure(response: BogenligaResponse<LigaDO>) {
    this.loading = false;

  }

  private handleDeleteSuccess(response: BogenligaResponse<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_LIGA_SUCCESS,
      title:       'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.DELETE_SUCCESS.TITLE',
      description: 'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.DELETE_SUCCESS.DESCRIPTION',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_LIGA_SUCCESS)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.router.navigateByUrl('/verwaltung/liga');
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleDeleteFailure(response: BogenligaResponse<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_LIGA_FAILURE,
      title:       'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.DELETE_FAILURE.TITLE',
      description: 'MANAGEMENT.LIGA_DETAIL.NOTIFICATION.DELETE_FAILURE.DESCRIPTION',
      severity:    NotificationSeverity.ERROR,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_LIGA_FAILURE)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleResponseArraySuccess(response: BogenligaResponse<RegionDO[]>): void {
    this.regionen = [];
    this.regionen = response.payload;
    if (this.id === 'add') {
      this.currentRegion = this.regionen[0];
    } else {
      this.currentRegion = this.regionen.filter((region) => region.id === this.currentLiga.regionId)[0];
    }
    this.loading = false;
  }

  private handleResponseArrayFailure(response: BogenligaResponse<RegionDTO[]>): void {
    this.regionen = [];
    this.loading = false;
  }

  private handlUebergeordnetResponseArraySuccess(response: BogenligaResponse<LigaDO[]>): void {
    this.allUebergeordnete = [];
    this.allUebergeordnete = response.payload;
    if (this.id === 'add') {
      this.currentUbergeordneteLiga = this.allUebergeordnete[0];
    } else {
      this.currentUbergeordneteLiga = this.allUebergeordnete.filter((uebergeordnet) => uebergeordnet.id === this.currentLiga.ligaUebergeordnetId)[0];
    }
    this.loading = false;
  }

  private handleUebergeordnetResponseArrayFailure(response: BogenligaResponse<LigaDTO[]>): void {
    this.allUebergeordnete = [];
    this.loading = false;
  }

  private handleUserResponseArraySuccess(response: BogenligaResponse<UserProfileDO[]>): void {
    this.allUsers = [];
    this.allUsers = response.payload;
    if (this.id === 'add') {
      this.currentUser = this.allUsers[0];
    } else {
      this.currentUser = this.allUsers.filter((user) => user.id === this.currentLiga.ligaVerantwortlichId)[0];
    }
    this.loading = false;
  }

  private handleUserResponseArrayFailure(response: BogenligaResponse<UserProfileDTO[]>): void {
    this.allUsers = [];
    this.loading = false;
  }
}
