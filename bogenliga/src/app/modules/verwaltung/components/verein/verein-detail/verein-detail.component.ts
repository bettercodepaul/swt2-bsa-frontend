import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {
  ButtonType,
  CommonComponentDirective,
  hideLoadingIndicator,
  showDeleteLoadingIndicatorIcon,
  toTableRows
} from '../../../../shared/components';
import {BogenligaResponse, UriBuilder} from '../../../../shared/data-provider';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';
import {RegionDataProviderService} from '../../../services/region-data-provider.service';
import {VereinDataProviderService} from '../../../services/verein-data-provider.service';
import {RegionDTO} from '../../../types/datatransfer/region-dto.class';
import {DsbMitgliedDO} from '../../../types/dsb-mitglied-do.class';
import {RegionDO} from '../../../types/region-do.class';
import {VereinDO} from '../../../types/verein-do.class';
import {VEREIN_DETAIL_CONFIG, VEREIN_DETAIL_TABLE_CONFIG} from './verein-detail.config';
import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {DsbMannschaftDataProviderService} from '@verwaltung/services/dsb-mannschaft-data-provider.service';
import {DsbMannschaftDTO} from '@verwaltung/types/datatransfer/dsb-mannschaft-dto.class';
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';
import {VeranstaltungDTO} from '@verwaltung/types/datatransfer/veranstaltung-dto.class';
import {environment} from '@environment';
import {DownloadButtonResourceProviderService} from '@shared/components/buttons/download-button/services/download-button-resource-provider.service';
import {CurrentUserService} from '@shared/services';

const ID_PATH_PARAM = 'id';
const NOTIFICATION_DELETE_VEREIN = 'verein_detail_delete';
const NOTIFICATION_DELETE_VEREIN_SUCCESS = 'verein_detail_delete_success';
const NOTIFICATION_DELETE_VEREIN_FAILURE = 'verein_detail_delete_failure';
const NOTIFICATION_SAVE_VEREIN = 'verein_detail_save';
const NOTIFICATION_UPDATE_VEREIN = 'verein_detail_update';
const NOTIFICATION_DELETE_MANNSCHAFT = 'mannschaft_detail_delete';
const NOTIFICATION_DELETE_MANNSCHAFT_SUCCESS = 'mannschaft_detail_delete_success';
const NOTIFICATION_DELETE_MANNSCHAFT_FAILURE = 'mannschaft_detail_delete_failure';
const NOTIFICATION_NO_LICENSE = 'no_license_found';

@Component({
  selector:    'bla-verein-detail',
  templateUrl: './verein-detail.component.html',
  styleUrls:   ['./verein-detail.component.scss']
})
export class VereinDetailComponent extends CommonComponentDirective implements OnInit {
  public regionType = 'KREIS';
  public config = VEREIN_DETAIL_CONFIG;
  public config_table = VEREIN_DETAIL_TABLE_CONFIG;
  public rows: TableRow[];
  public ButtonType = ButtonType;
  public currentVerein: VereinDO = new VereinDO();
  public currentRegion: RegionDO = new RegionDO();
  public regionen: Array<RegionDO> = [new RegionDO()];
  public mannschaften: Array<DsbMannschaftDO> = [new DsbMannschaftDO()];

  public deleteLoading = false;
  public saveLoading = false;


  @ViewChild('downloadLink')
  private aElementRef: ElementRef;
  constructor(private vereinProvider: VereinDataProviderService,
              private downloadService: DownloadButtonResourceProviderService,
              private regionProvider: RegionDataProviderService,
              private currentUserService: CurrentUserService,
              private mannschaftsDataProvider: DsbMannschaftDataProviderService,
              private veranstaltungsProvider: VeranstaltungDataProviderService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.loading = true;
    this.notificationService.discardNotification();
    this.loadRegions(this.regionType); // Request all regions from the backend
  }

  private loadVerein(): void {
    this.route.params.subscribe((params) => {
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
    this.currentVerein.regionId = this.currentRegion.id; // Set selected region id
    // check if website has http:// in it. If not then add it
    if (!this.currentVerein.website === undefined) {
      if (this.currentVerein.website.search('http://')) {
        this.currentVerein.website = 'http://' + this.currentVerein.website;
      }
    }

    console.log('Saving verein: ', this.currentVerein);

    this.vereinProvider.create(this.currentVerein)
        .then((response: BogenligaResponse<VereinDO>) => {
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
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/vereine/' + response.payload.id);
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
    this.currentVerein.regionId = this.currentRegion.id; // Set selected region id
    // check if website has http:// in it. If not then add it
    if (this.currentVerein.website !== '') {
      if (this.currentVerein.website.search('http://')) {
        this.currentVerein.website = 'http://' + this.currentVerein.website;
      }
    }

    this.vereinProvider.update(this.currentVerein)
        .then((response: BogenligaResponse<VereinDO>) => {
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
                .subscribe((myNotification) => {
                  if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
                    this.saveLoading = false;
                    this.router.navigateByUrl('/verwaltung/vereine');
                  }
                });

            this.notificationService.showNotification(notification);
          }
        }, (response: BogenligaResponse<DsbMitgliedDO>) => {
          const notification: Notification = {
            id: NOTIFICATION_UPDATE_VEREIN,
            title:       'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.SAVE_FAILURE.TITLE',
            description: 'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.SAVE_FAILURE.DESCRIPTION',
            severity: NotificationSeverity.INFO,
            origin: NotificationOrigin.USER,
            type: NotificationType.OK,
            userAction: NotificationUserAction.PENDING
          };
          this.notificationService.showNotification(notification);


          console.log('Failed');
          this.saveLoading = false;
        });
    // show response message
  }

  /**
   * Base64 is a process to store e.g. images as 8-bit binary files.
   * It is called if an image (logo) is inside the upload field.
   */
  public convertIconToBase64($event): void {
    this.readThis($event.target);
  }

  public readThis(inputValue: any): void {
    const file: File = inputValue.files[0];
    const myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.currentVerein.icon = String(myReader.result);
    };

    myReader.readAsDataURL(file);
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
        .subscribe((myNotification) => {

          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.vereinProvider.deleteById(id)
                .then((response) => this.handleDeleteSuccess(response))
                .catch((response) => this.handleDeleteFailure(response));
          } else if (myNotification.userAction === NotificationUserAction.DECLINED) {
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  public onDeleteMannschaft(versionedDataObject: VersionedDataObject): void {

    this.notificationService.discardNotification();

    const id = versionedDataObject.id;
    this.rows = showDeleteLoadingIndicatorIcon(this.rows, id);

    const notification: Notification = {
      id:               NOTIFICATION_DELETE_MANNSCHAFT + id,
      title:            'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.MANNSCHAFT_DETAIL.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    const notificationEvent = this.notificationService.observeNotification(NOTIFICATION_DELETE_MANNSCHAFT + id)
        .subscribe((myNotification) => {

          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.mannschaftsDataProvider.deleteById(id)
                .then((response) => this.loadMannschaften())
                .catch((response) => this.rows = hideLoadingIndicator(this.rows, id));
          } else if (myNotification.userAction === NotificationUserAction.DECLINED) {
            this.rows = hideLoadingIndicator(this.rows, id);
            notificationEvent.unsubscribe();
          }

        });

    this.notificationService.showNotification(notification);
  }

  public onDownloadRueckennummer(versionedDataObject: VersionedDataObject): void {
    const URL: string = new UriBuilder()
      .fromPath(environment.backendBaseUrl)
      .path('v1/download')
      .path('pdf/rueckennummern')
      .path('?mannschaftid=' + versionedDataObject.id)
      .build();
    this.downloadService.download(URL, 'rueckennummern.pdf', this.aElementRef)
        .then((response: BogenligaResponse<string>) => console.log(response))
        .catch((response: BogenligaResponse<string>) => console.log(response));
  }

  public onDownloadLizenzen(versionedDataObject: VersionedDataObject): void {
    const URL: string = new UriBuilder()
      .fromPath(environment.backendBaseUrl)
      .path('v1/download')
      .path('pdf/lizenzen')
      .path('?mannschaftid=' + versionedDataObject.id)
      .build();
    this.downloadService.download(URL, 'lizenzen.pdf', this.aElementRef)
        .then((response: BogenligaResponse<string>) => console.log(response))
        .catch((response: BogenligaResponse<string>) => this.showNoLicense());
  }

  public onView(versionedDataObject: VersionedDataObject): void {
    this.navigateToDetailDialog(versionedDataObject);

  }

  public onEdit(versionedDataObject: VersionedDataObject): void {
    this.navigateToDetailDialog(versionedDataObject);
  }

  public entityExists(): boolean {
    return this.currentVerein.id >= 0;
  }

  private loadById(id: number) {
    this.vereinProvider.findById(id)
        .then((response: BogenligaResponse<VereinDO>) => this.handleSuccess(response))
        .catch((response: BogenligaResponse<VereinDO>) => this.handleFailure(response));
  }

  private loadRegions(type: string) {
    this.regionProvider.findAllByType(type)
        .then((response: BogenligaResponse<RegionDO[]>) => {
          this.handleResponseArraySuccess(response);
          this.loadVerein();
        } )
        .catch((response: BogenligaResponse<RegionDTO[]>) => this.handleResponseArrayFailure(response));
  }

  private handleSuccess(response: BogenligaResponse<VereinDO>) {
    this.currentVerein = response.payload;
    this.loadMannschaften();
    this.loading = false;

    this.currentRegion = this.regionen.filter((region) => region.id === this.currentVerein.regionId)[0];

  }

  private handleFailure(response: BogenligaResponse<VereinDO>) {
    this.loading = false;
  }

  private handleDeleteSuccess(response: BogenligaResponse<void>): void {

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
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.router.navigateByUrl('/verwaltung/vereine');
            this.deleteLoading = false;
          }
        });

    this.notificationService.showNotification(notification);
  }

  private handleDeleteFailure(response: BogenligaResponse<void>): void {

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
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.deleteLoading = false;
          }
        });
    this.notificationService.showNotification(notification);
  }

  private showNoLicense(): void {
    const noLicenseNotification: Notification = {
      id: NOTIFICATION_NO_LICENSE,
      title: 'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.NO_LICENSE.TITLE',
      description: 'MANAGEMENT.VEREIN_DETAIL.NOTIFICATION.NO_LICENSE.DESCRIPTION',
      severity: NotificationSeverity.ERROR,
      origin: NotificationOrigin.USER,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };
    this.notificationService.observeNotification(NOTIFICATION_NO_LICENSE)
      .subscribe((myNotification) => {
        if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
          this.saveLoading = false;
        }
      });
    this.notificationService.showNotification(noLicenseNotification);
  }

  private handleResponseArrayFailure(response: BogenligaResponse<RegionDTO[]>): void {
    this.regionen = [];
    this.loading = false;
  }

  private handleResponseArraySuccess(response: BogenligaResponse<RegionDO[]>): void {
    this.regionen = []; // reset array to ensure change detection
    this.regionen = response.payload;
    this.currentRegion = this.regionen[0]; // Set first element of object as selected.

    this.loading = false;
  }

  private loadMannschaften() {
    this.loading = true;
    this.mannschaftsDataProvider.findAllByVereinsId(this.currentVerein.id)
        .then((response: BogenligaResponse<DsbMannschaftDTO[]>) => this.handleLoadMannschaftenSuccess(response))
        .catch((response: BogenligaResponse<DsbMannschaftDTO[]>) => this.handleLoadMannschaftenFailure(response));
  }

  private handleLoadMannschaftenSuccess(response: BogenligaResponse<DsbMannschaftDTO[]>): void {
    this.mannschaften = [];
    this.mannschaften = response.payload;
    this.mannschaften.forEach((mannschaft) => this.addTableAttributes(mannschaft));
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }

  private addTableAttributes(mannschaft: DsbMannschaftDO) {
    this.veranstaltungsProvider.findById(mannschaft.veranstaltungId)
        .then((response: BogenligaResponse<VeranstaltungDTO>) => mannschaft.veranstaltungName = response.payload.name)
        .catch((response: BogenligaResponse<VeranstaltungDTO>) => mannschaft.veranstaltungName = '');
    mannschaft.name = this.currentVerein.name + ' '  + mannschaft.nummer + '.Mannschaft';
  }

  private handleLoadMannschaftenFailure(response: BogenligaResponse<DsbMannschaftDTO[]>): void {
    this.mannschaften = [];
    this.loading = false;
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/vereine/' + this.currentVerein.id + '/' + versionedDataObject.id);
  }
}
