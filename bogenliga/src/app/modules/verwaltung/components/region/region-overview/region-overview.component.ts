import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonComponentDirective} from '../../../../shared/components/common';
import {hideLoadingIndicator, showDeleteLoadingIndicatorIcon, toTableRows} from '../../../../shared/components/tables';
import {TableRow} from '../../../../shared/components/tables/types/table-row.class';
import {BogenligaResponse} from '../../../../shared/data-provider';
import {VersionedDataObject} from '../../../../shared/data-provider/models/versioned-data-object.interface';
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
import {REGION_OVERVIEW_CONFIG} from './region-overview.config';

export const NOTIFICATION_DELETE_REGIONEN = 'region_overview_delete';

@Component({
  selector: 'bla-region-overview',
  templateUrl: './region-overview.component.html',
  styleUrls: ['./region-overview.component.scss']
})
export class RegionOverviewComponent extends CommonComponentDirective implements OnInit {

  public config = REGION_OVERVIEW_CONFIG;
  public rows: TableRow[];
  public searchTerm = 'searchTermRegion';

  constructor(private regionDataProvider: RegionDataProviderService, private router: Router, private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.loading = true;
    if (!localStorage.getItem(this.searchTerm))
      this.loadTableRows();
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
            this.regionDataProvider.deleteById(id)
                .then((response) => this.loadTableRows())
                .catch((response) => this.rows = hideLoadingIndicator(this.rows, id));
          } else if (myNotification.userAction === NotificationUserAction.DECLINED) {
            this.rows = hideLoadingIndicator(this.rows, id);
          }
        });

    this.notificationService.showNotification(notification);

  }

  private loadTableRows() {
    this.regionDataProvider.findAll()
        .then((response: BogenligaResponse<RegionDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<RegionDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  public findBySearch($event: string) {
    this.regionDataProvider.findBySearch($event)
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
