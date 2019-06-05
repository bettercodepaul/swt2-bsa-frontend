import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {ButtonType, CommonComponent} from '../../../../shared/components';
import {BogenligaResponse} from '../../../../shared/data-provider';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';
import {RegionDataProviderService} from '../../../services/region-data-provider.service';
import {RegionDTO} from '../../../types/datatransfer/region-dto.class';
import {DsbMitgliedDO} from '../../../types/dsb-mitglied-do.class';
import {RegionDO} from '../../../types/region-do.class';
import {REGION_DETAIL_CONFIG} from './region-detail.config';
import {UserProfileDO} from '@user/types/user-profile-do.class';
import {LigaDO} from '@verwaltung/types/liga-do.class';
import {UserProfileDataProviderService} from '@user/services/user-profile-data-provider.service';
import {LigaDTO} from '@verwaltung/types/datatransfer/liga-dto.class';


const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_REGION = 'region_detail_delete';
const NOTIFICATION_DELETE_REGION_SUCCESS = 'region_detail_delete_success';
const NOTIFICATION_DELETE_REGION_FAILURE = 'region_detail_delete_failure';
const NOTIFICATION_SAVE_REGION = 'region_detail_save';
const NOTIFICATION_UPDATE_REGION = 'region_detail_update';

@Component({
  selector:    'bla-region-detail',
  templateUrl: './region-detail.component.html',
  styleUrls:   ['./region-detail.component.scss']
})
export class RegionDetailComponent extends CommonComponent implements OnInit {
  public config = REGION_DETAIL_CONFIG;
  public ButtonType = ButtonType;
  public currentRegion: RegionDO = new RegionDO();

  public possibleRegionTypes: Array<string> = ['BUNDESVERBAND', 'LANDESVERBAND', 'BEZIRK', 'KREIS'];
  public possibleRegionTypes2: Array<string> = ['BUNDESVERBAND', 'LANDESVERBAND', 'BEZIRK', 'KREIS'];
  public regionen: Array<RegionDO> = [new RegionDO()];
  public uebergeordneteRegionenGefiltert: Array<RegionDO> = [new RegionDO()];
  public uebergeordneteRegionenGefiltertStrings: Array<string> = [];

  public deleteLoading = false;
  public saveLoading = false;

  public contractionUnique = true;

  public id;

  constructor(private regionProvider: RegionDataProviderService,
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
        const id = params[ID_PATH_PARAM];
        if (id === 'add') {
          this.currentRegion = new RegionDO();

          this.loadRegions();

          this.loading = false;
          this.deleteLoading = false;
          this.saveLoading = false;
        } else {
          this.loadRegions();
          this.loadById(params[ID_PATH_PARAM]);
        }
      }
    });
  }

  public onSave(ignore: any): void {
    this.saveLoading = true;

    if (this.currentRegion.regionUebergeordnetAsName === 'Diese Region hat keine übergeordnete Region') {
      this.currentRegion.regionUebergeordnetAsName = null;
      this.currentRegion.regionUebergeordnet = null;
    }

    console.log('Saving region: ', this.currentRegion);

    this.regionProvider.create(this.currentRegion)
        .then((response: BogenligaResponse<RegionDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            const notification: Notification = {
              id:          NOTIFICATION_SAVE_REGION,
              title:       'MANAGEMENT.REGION_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.REGION_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_SAVE_REGION)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/regionen');
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: BogenligaResponse<DsbMitgliedDO>) => {
          console.log('Failed');
          this.saveLoading = false;


        });
    // show response message
  }

  public onUpdate(ignore: any): void {
    this.saveLoading = true;

    // persist

    if (this.currentRegion.regionUebergeordnetAsName === 'Diese Region hat keine übergeordnete Region') {
      this.currentRegion.regionUebergeordnetAsName = null;
      this.currentRegion.regionUebergeordnet = null;
    }
    this.regionProvider.update(this.currentRegion)
        .then((response: BogenligaResponse<RegionDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {

            const id = this.currentRegion.id;

            const notification: Notification = {
              id:          NOTIFICATION_UPDATE_REGION + id,
              title:       'MANAGEMENT.REGION_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.REGION_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_UPDATE_REGION + id)
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/regionen');
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: BogenligaResponse<DsbMitgliedDO>) => {
          console.log('Failed');
          this.saveLoading = false;
        });
    // show response message
  }

  public onDelete(ignore: any): void {
    this.deleteLoading = true;
    this.notificationService.discardNotification();

    const id = this.currentRegion.id;

    const notification: Notification = {
      id:               NOTIFICATION_DELETE_REGION + id,
      title:            'MANAGEMENT.REGION_DETAIL.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.REGION_DETAIL.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_REGION + id)
        .subscribe((myNotification) => {

          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.regionProvider.deleteById(id)
                .then((response) => this.handleDeleteSuccess(response))
                .catch((response) => this.handleDeleteFailure(response));
          }
        });

    this.notificationService.showNotification(notification);
  }

  public entityExists(): boolean {
    return this.currentRegion.id >= 0;
  }

  private loadById(id: number) {
    this.regionProvider.findById(id)
        .then((response: BogenligaResponse<RegionDO>) => this.handleSuccess(response))
        .catch((response: BogenligaResponse<RegionDO>) => this.handleFailure(response));
  }

  private loadRegions() {
    this.regionProvider.findAll()
        .then((response: BogenligaResponse<RegionDO[]>) => this.handleResponseArraySuccess(response))
        .catch((response: BogenligaResponse<RegionDTO[]>) => this.handleResponseArrayFailure(response));
  }

  private handleSuccess(response: BogenligaResponse<RegionDO>) {
    this.currentRegion = response.payload;

    this.possibleRegionTypes = this.possibleRegionTypes2;

    this.filterRegions();

    this.filterRegionTypes();

    this.loading = false;
  }

  private handleFailure(response: BogenligaResponse<RegionDO>) {
    this.loading = false;
  }

  private handleDeleteSuccess(response: BogenligaResponse<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_REGION_SUCCESS,
      title:       'MANAGEMENT.REGION_DETAIL.NOTIFICATION.DELETE_SUCCESS.TITLE',
      description: 'MANAGEMENT.REGION_DETAIL.NOTIFICATION.DELETE_SUCCESS.DESCRIPTION',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_REGION_SUCCESS)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.router.navigateByUrl('/verwaltung/regionen');
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleDeleteFailure(response: BogenligaResponse<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_REGION_FAILURE,
      title:       'MANAGEMENT.REGION_DETAIL.NOTIFICATION.DELETE_FAILURE.TITLE',
      description: 'MANAGEMENT.REGION_DETAIL.NOTIFICATION.DELETE_FAILURE.DESCRIPTION',
      severity:    NotificationSeverity.ERROR,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_REGION_FAILURE)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleResponseArrayFailure(response: BogenligaResponse<RegionDTO[]>): void {
    this.regionen = [];
    this.loading = false;
  }

  private handleResponseArraySuccess(response: BogenligaResponse<RegionDO[]>): void {
    this.regionen = []; // reset array to ensure change detection
    this.regionen = response.payload;
    // setting the Typ as a default Typ
    if (this.currentRegion.regionUebergeordnetAsName == null) {
      this.currentRegion.regionUebergeordnetAsName = this.regionen[1].regionName;
    }
    this.filterRegionTypes();

    this.filterRegions();

    this.loading = false;
  }

  private filterRegions(): void {
    this.uebergeordneteRegionenGefiltert = [];
    this.uebergeordneteRegionenGefiltertStrings = [];

    if (this.currentRegion.regionTyp === 'LANDESVERBAND') {
      this.uebergeordneteRegionenGefiltert = this.regionen.filter((region) => region.regionTyp === 'BUNDESVERBAND');
    } else if (this.currentRegion.regionTyp === 'BEZIRK') {
      this.uebergeordneteRegionenGefiltert = this.regionen.filter((region) => region.regionTyp === 'LANDESVERBAND');
    } else if (this.currentRegion.regionTyp === 'KREIS') {
      this.uebergeordneteRegionenGefiltert = this.regionen.filter((region) => region.regionTyp === 'BEZIRK');
    } else if (this.currentRegion.regionTyp === 'BUNDESVERBAND') {
      this.uebergeordneteRegionenGefiltert = [];
    }

    this.uebergeordneteRegionenGefiltert = this.uebergeordneteRegionenGefiltert.filter((region) => region.regionName !== this.currentRegion.regionUebergeordnetAsName);

    this.uebergeordneteRegionenGefiltert.forEach((region) => {this.uebergeordneteRegionenGefiltertStrings.push(region.regionName); });
  }

  public filterRegionTypes(): void {
    if (this.currentRegion.regionTyp == null) {
      this.currentRegion.regionTyp = this.possibleRegionTypes[2];
      this.possibleRegionTypes = this.possibleRegionTypes2.filter((s) => s !== this.currentRegion.regionTyp);
    } else {
      this.possibleRegionTypes = this.possibleRegionTypes2.filter((s) => s !== this.currentRegion.regionTyp);
    }
  }

  public isContractionUnique(): boolean {
    this.contractionUnique = true;
    this.regionen.forEach((region) => {
      if (region.regionKuerzel === this.currentRegion.regionKuerzel) {
        this.contractionUnique = false;
      }
    });
    return this.contractionUnique;
  }
}
