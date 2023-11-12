import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {
  ButtonType,
  CommonComponentDirective,
  hideLoadingIndicator,
  showDeleteLoadingIndicatorIcon, toTableRows
} from '../../../shared/components';
import {BogenligaResponse} from '../../../shared/data-provider';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../shared/services/notification';
import {RegionDataProviderService} from '../../services/region-data-provider.service';

import {RegionDO} from '../../types/region-do.class';
import { SYNC_OVERVIEW_CONFIG} from './syncdaten.config';
import {UserProfileDataProviderService} from '@user/services/user-profile-data-provider.service';
import {SessionHandling} from '@shared/event-handling';
import {CurrentUserService, OnOfflineService} from '@shared/services';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';
import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';
import {RegionDTO} from '@verwaltung/types/datatransfer/region-dto.class';
import {NOTIFICATION_DELETE_REGIONEN} from '@verwaltung/components';
import {TableRow} from '@shared/components/tables/types/table-row.class';



const ID_PATH_PARAM = 'id';

@Component({
  selector:    'bla-daten-detail',
  templateUrl: './syncdaten.component.html',
  styleUrls:   ['./syncdaten.component.scss']
})
export class SyncdatenComponent extends CommonComponentDirective implements OnInit {
  public rows: TableRow[];
  public config = SYNC_OVERVIEW_CONFIG;
  public ButtonType = ButtonType;
  public deleteLoading = false;
  public saveLoading = false;
  public searchTerm = 'searchTermSync';
  public id;


  private sessionHandling: SessionHandling;

  public ActionButtonColors = ActionButtonColors;


  constructor(private SyncdatenDataProvider: RegionDataProviderService,
    private userProvider: UserProfileDataProviderService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private currentUserService: CurrentUserService,
    private onOfflineService: OnOfflineService) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);
  }

  ngOnInit() {
    this.loading = true;

    this.notificationService.discardNotification();

  }

  /** When a MouseOver-Event is triggered, it will call this inMouseOver-function.
   *  This function calls the checkSessionExpired-function in the sessionHandling class and get a boolean value back.
   *  If the boolean value is true, then the page will be reloaded and due to the expired session, the user will
   *  be logged out automatically.
   */
  public onMouseOver(event: any) {
    const isExpired = this.sessionHandling.checkSessionExpired();
    if (isExpired) {
      window.location.reload();
    }
  }

  public onView(versionedDataObject: VersionedDataObject): void {
    this.navigateToDetailDialog(versionedDataObject);

  }

  public onEdit(versionedDataObject: VersionedDataObject): void {
    this.navigateToDetailDialog(versionedDataObject);
  }

  public onDelete(versionedDataObject: VersionedDataObject): void {
    // show loading icon
    const id = versionedDataObject.id;

    this.rows = showDeleteLoadingIndicatorIcon(this.rows, id);

    const notification: Notification = {
      id:               NOTIFICATION_DELETE_REGIONEN + id,
      title:            'MANAGEMENT.REGIONEN.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.REGIONEN.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };


    this.notificationService.observeNotification(NOTIFICATION_DELETE_REGIONEN + id)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.SyncdatenDataProvider.deleteById(id)
                .then((response) => this.loadTableRows())
                .catch((response) => this.rows = hideLoadingIndicator(this.rows, id));
          } else if (myNotification.userAction === NotificationUserAction.DECLINED) {
            this.rows = hideLoadingIndicator(this.rows, id);
          }
        });

    this.notificationService.showNotification(notification);

  }

  private loadTableRows() {
    this.SyncdatenDataProvider.findAll()
        .then((response: BogenligaResponse<RegionDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<RegionDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  public findBySearch($event: string) {
    this.SyncdatenDataProvider.findBySearch($event)
        .then((response: BogenligaResponse<RegionDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<RegionDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/regionen/' + versionedDataObject.id);
  }

  private handleLoadTableRowsFailure(response: BogenligaResponse<RegionDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<RegionDTO[]>): void {
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }
}
