import {Component, OnInit} from '@angular/core';
import {
  Notification,
  NotificationOrigin,
  NotificationService, NotificationSeverity, NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';
import {Response} from '../../../../shared/data-provider';
import {ButtonType, CommonComponent} from '../../../../shared/components';
import {isNullOrUndefined, isUndefined} from 'util';
import {DsbMitgliedDO} from '../../../types/dsb-mitglied-do.class';
import {ActivatedRoute, Router} from '@angular/router';
import {VereinDO} from '../../../types/verein-do.class';
import {VereinDataProviderService} from '../../../services/verein-data-provider.service';
import {VEREIN_DETAIL_CONFIG} from './verein-detail.config';
import {RegionDataProviderService} from '../../../services/region-data-provider.service';
import {RegionDO} from '../../../types/region-do.class';
import {RegionDTO} from '../../../types/datatransfer/region-dto.class';


const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_VEREIN = 'verein_detail_delete';
const NOTIFICATION_DELETE_VEREIN_SUCCESS = 'verein_detail_delete_success';
const NOTIFICATION_DELETE_VEREIN_FAILURE = 'verein_detail_delete_failure';
const NOTIFICATION_SAVE_VEREIN = 'verein_detail_save';
const NOTIFICATION_UPDATE_VEREIN = 'verein_detail_update';

@Component({
  selector:    'bla-verein-detail',
  templateUrl: './verein-detail.component.html',
  styleUrls:   ['./verein-detail.component.scss']
})
export class VereinDetailComponent extends CommonComponent implements OnInit {

  public config = VEREIN_DETAIL_CONFIG;
  public ButtonType = ButtonType;
  public currentVerein: VereinDO = new VereinDO();
  public currentRegion: RegionDO = new RegionDO();
  public regionen: Array<RegionDO> = [new RegionDO()];

  public deleteLoading = false;
  public saveLoading = false;

  constructor(private vereinProvider: VereinDataProviderService,
    private regionProvider: RegionDataProviderService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.loading = true;

    this.notificationService.discardNotification();

    this.loadRegions(); //Request all regions from the backend

    this.route.params.subscribe(params => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        const id = params[ID_PATH_PARAM];
        if (id === 'add') {
          this.currentVerein = new VereinDO();
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

    // persist
    this.currentVerein.regionId = this.currentRegion.id; //Set selected region id

    console.log("Saving verein: ", this.currentVerein);

    this.vereinProvider.create(this.currentVerein)
        .then((response: Response<VereinDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {
            console.log('Saved with id: ' + response.payload.id);

            const notification: Notification = {
              id:          NOTIFICATION_SAVE_VEREIN,
              title:       'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_SAVE_VEREIN)
                .subscribe(myNotification => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/vereine/' + response.payload.id);
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: Response<DsbMitgliedDO>) => {
          console.log('Failed');
          this.saveLoading = false;


        });
    // show response message
  }

  public onUpdate(ignore: any): void {
    this.saveLoading = true;

    // persist
    this.currentVerein.regionId = this.currentRegion.id; //Set selected region id

    this.vereinProvider.update(this.currentVerein)
        .then((response: Response<VereinDO>) => {
          if (!isNullOrUndefined(response)
            && !isNullOrUndefined(response.payload)
            && !isNullOrUndefined(response.payload.id)) {

            const id = this.currentVerein.id;

            const notification: Notification = {
              id:          NOTIFICATION_UPDATE_VEREIN + id,
              title:       'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.SAVE.TITLE',
              description: 'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.SAVE.DESCRIPTION',
              severity:    NotificationSeverity.INFO,
              origin:      NotificationOrigin.USER,
              type:        NotificationType.OK,
              userAction:  NotificationUserAction.PENDING
            };

            this.notificationService.observeNotification(NOTIFICATION_UPDATE_VEREIN + id)
                .subscribe(myNotification => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/vereine');
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: Response<DsbMitgliedDO>) => {
          console.log('Failed');
          this.saveLoading = false;
        });
    // show response message
  }

  public onDelete(ignore: any): void {
    this.deleteLoading = true;
    this.notificationService.discardNotification();

    const id = this.currentVerein.id;

    const notification: Notification = {
      id:               NOTIFICATION_DELETE_VEREIN + id,
      title:            'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_VEREIN + id)
        .subscribe(myNotification => {

          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.vereinProvider.deleteById(id)
                .then(response => this.handleDeleteSuccess(response))
                .catch(response => this.handleDeleteFailure(response));
          }
        });

    this.notificationService.showNotification(notification);
  }

  public entityExists(): boolean {
    return this.currentVerein.id >= 0;
  }

  private loadById(id: number) {
    this.vereinProvider.findById(id)
        .then((response: Response<VereinDO>) => this.handleSuccess(response))
        .catch((response: Response<VereinDO>) => this.handleFailure(response));
  }

  private loadRegions() {
    this.regionProvider.findAll()
        .then((response: Response<RegionDO[]>) => this.handleResponseArraySuccess(response))
        .catch((response: Response<RegionDTO[]>) => this.handleResponseArrayFailure(response));
  }



  private handleSuccess(response: Response<VereinDO>) {
    this.currentVerein = response.payload;
    this.loading = false;

    this.currentRegion = this.regionen.filter(region=> region.id === this.currentVerein.regionId)[0];
  }

  private handleFailure(response: Response<VereinDO>) {
    this.loading = false;
  }

  private handleDeleteSuccess(response: Response<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_VEREIN_SUCCESS,
      title:       'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.DELETE_SUCCESS.TITLE',
      description: 'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.DELETE_SUCCESS.DESCRIPTION',
      severity:    NotificationSeverity.INFO,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_VEREIN_SUCCESS)
        .subscribe(myNotification => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.router.navigateByUrl('/verwaltung/vereine');
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleDeleteFailure(response: Response<void>): void {

    const notification: Notification = {
      id:          NOTIFICATION_DELETE_VEREIN_FAILURE,
      title:       'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.DELETE_FAILURE.TITLE',
      description: 'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.DELETE_FAILURE.DESCRIPTION',
      severity:    NotificationSeverity.ERROR,
      origin:      NotificationOrigin.USER,
      type:        NotificationType.OK,
      userAction:  NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_VEREIN_FAILURE)
        .subscribe(myNotification => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleResponseArrayFailure(response: Response<RegionDTO[]>): void {
    this.regionen = [];
    this.loading = false;
  }

  private handleResponseArraySuccess(response: Response<RegionDO[]>): void {
    this.regionen = []; // reset array to ensure change detection
    this.regionen = response.payload;
    this.currentRegion = this.regionen[0]; // Set first element of object as selected.

    this.loading = false;
  }
}
