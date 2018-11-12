import {Component, OnInit} from '@angular/core';
import {DSB_MANNSCHAFT_OVERVIEW_CONFIG} from './mannschaft-overview.config';
import {MannschaftDataProviderService} from '../../../services/mannschaft-data-provider.service';
import {TableRow} from '../../../../shared/components/tables/types/table-row.class';
import {CommonComponent} from '../../../../shared/components/common';
import {Response} from '../../../../shared/data-provider';
import {MannschaftDTO} from '../../../types/datatransfer/mannschaft-dto.class';
import {VersionedDataObject} from '../../../../shared/data-provider/models/versioned-data-object.interface';
import {Router} from '@angular/router';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';
import {hideLoadingIndicator, showDeleteLoadingIndicatorIcon, toTableRows} from '../../../../shared/components/tables';

export const NOTIFICATION_DELETE_MANNSCHAFT = 'mannschaft_overview_delete';

@Component({
  selector:    'bla-mannschaft-overview',
  templateUrl: './mannschaft-overview.component.html',
  styleUrls:   ['./mannschaft-overview.component.scss']
})
export class MannschaftOverviewComponent extends CommonComponent implements OnInit {

  public config = DSB_MANNSCHAFT_OVERVIEW_CONFIG;
  public rows: TableRow[];

  constructor(private MannschaftDataProvider: MannschaftDataProviderService, private router: Router, private notificationService: NotificationService) {
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
      id:               NOTIFICATION_DELETE_MANNSCHAFT + id,
      title:            'MANAGEMENT.MANNSCHAFT.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.MANNSCHAFT.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_MANNSCHAFT + id)
        .subscribe(myNotification => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.MannschaftDataProvider.deleteById(id)
                .then(response => this.loadTableRows())
                .catch(response => this.rows = hideLoadingIndicator(this.rows, id));
          }
        });

    this.notificationService.showNotification(notification);

  }

  private loadTableRows() {
    this.loading = true;

    this.MannschaftDataProvider.findAll()
        .then((response: Response<MannschaftDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: Response<MannschaftDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/dsbmitglieder/' + versionedDataObject.id);
  }

  private handleLoadTableRowsFailure(response: Response<MannschaftDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: Response<MannschaftDTO[]>): void {
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }
}
