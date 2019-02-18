import {Component, OnInit} from '@angular/core';
import {DSB_MANNSCHAFT_OVERVIEW_CONFIG} from './dsb-mannschaft-overview.config';
import {DsbMannschaftDataProviderService} from '../../../services/dsb-mannschaft-data-provider.service';
import {TableRow} from '../../../../shared/components/tables/types/table-row.class';
import {CommonComponent} from '../../../../shared/components/common';
import {Response} from '../../../../shared/data-provider';
import {DsbMannschaftDTO} from '../../../types/datatransfer/dsb-mannschaft-dto.class';
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

export const NOTIFICATION_DELETE_DSB_MANNSCHAFT = 'dsb_mannschaft_overview_delete';

@Component({
  selector:    'bla-dsb-mannschaft-overview',
  templateUrl: './dsb-mannschaft-overview.component.html',
  styleUrls:   ['./dsb-mannschaft-overview.component.scss']
})
export class DsbMannschaftOverviewComponent extends CommonComponent implements OnInit {

  public config = DSB_MANNSCHAFT_OVERVIEW_CONFIG;
  public rows: TableRow[];

  constructor(private DsbMannschaftDataProvider: DsbMannschaftDataProviderService, private router: Router, private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.loadTableRows();
  }

  public onView(versionedDataObject: VersionedDataObject): void {
    this.navigateToDetailDialog2(versionedDataObject);

  }

  public onEdit(versionedDataObject: VersionedDataObject): void {
    this.navigateToDetailDialog(versionedDataObject);
  }

  public onDelete(versionedDataObject: VersionedDataObject): void {
    // show loading icon
    const id = versionedDataObject.id;

    this.rows = showDeleteLoadingIndicatorIcon(this.rows, id);

    const notification: Notification = {
      id:               NOTIFICATION_DELETE_DSB_MANNSCHAFT + id,
      title:            'MANAGEMENT.DSBMANNSCHAFT.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.DSBMANNSCHAFT.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_DSB_MANNSCHAFT + id)
        .subscribe(myNotification => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.DsbMannschaftDataProvider.deleteById(id)
                .then(response => this.loadTableRows())
                .catch(response => this.rows = hideLoadingIndicator(this.rows, id));
          }
        });

    this.notificationService.showNotification(notification);

  }

  private loadTableRows() {
    this.loading = true;

    this.DsbMannschaftDataProvider.findAll()
        .then((response: Response<DsbMannschaftDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: Response<DsbMannschaftDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/dsbmannschaft/' + versionedDataObject.id);
  }

  private navigateToDetailDialog2(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/dsbmannschaft/' + versionedDataObject.id);
  }

  private handleLoadTableRowsFailure(response: Response<DsbMannschaftDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: Response<DsbMannschaftDTO[]>): void {
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }
}
