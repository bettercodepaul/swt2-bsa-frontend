import {Component, OnInit} from '@angular/core';
import {hideLoadingIndicator, showDeleteLoadingIndicatorIcon, toTableRows} from '../../../../shared/components/tables';
import {VersionedDataObject} from '../../../../shared/data-provider/models/versioned-data-object.interface';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';
import {Response} from '../../../../shared/data-provider';
import {TableRow} from '../../../../shared/components/tables/types/table-row.class';
import {Router} from '@angular/router';
import {CommonComponent} from '../../../../shared/components/common';
import {VEREIN_OVERVIEW_CONFIG} from './verein-overview.config';
import {VereinDataProviderService} from '../../../services/verein-data-provider.service';
import {VereinDTO} from '../../../types/datatransfer/verein-dto.class';

export const NOTIFICATION_DELETE_VEREINE = 'vereine_overview_delete';

@Component({
  selector: 'bla-verein-overview',
  templateUrl: './verein-overview.component.html',
  styleUrls: ['./verein-overview.component.scss']
})
export class VereinOverviewComponent extends CommonComponent implements OnInit {

  public config = VEREIN_OVERVIEW_CONFIG;
  public rows: TableRow[];

  constructor(private vereinDataProvider: VereinDataProviderService, private router: Router, private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
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
      id: NOTIFICATION_DELETE_VEREINE + id,
      title: 'MANAGEMENT.VEREINE.NOTIFICATION.DELETE.TITLE',
      description: 'MANAGEMENT.VEREINE.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity: NotificationSeverity.QUESTION,
      origin: NotificationOrigin.USER,
      type: NotificationType.YES_NO,
      userAction: NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_VEREINE + id)
        .subscribe(myNotification => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.vereinDataProvider.deleteById(id)
                .then(response => this.loadTableRows())
                .catch(response => this.rows = hideLoadingIndicator(this.rows, id));
          }
        });

    this.notificationService.showNotification(notification);

  }

  private loadTableRows() {
    this.loading = true;

    this.vereinDataProvider.findAll()
        .then((response: Response<VereinDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: Response<VereinDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/vereine/' + versionedDataObject.id);
  }

  private handleLoadTableRowsFailure(response: Response<VereinDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: Response<VereinDTO[]>): void {
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }

}
