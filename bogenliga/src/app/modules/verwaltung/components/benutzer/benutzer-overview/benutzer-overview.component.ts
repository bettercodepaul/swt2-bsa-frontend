import {Component, OnInit} from '@angular/core';
import {BENUTZER_OVERVIEW_CONFIG} from './benutzer-overview.config';
import {BenutzerDataProviderService} from '../../../services/benutzer-data-provider.service';
import {TableRow} from '../../../../shared/components/tables/types/table-row.class';
import {CommonComponent} from '../../../../shared/components/common';
import {BogenligaResponse} from '../../../../shared/data-provider';
import {BenutzerRolleDO} from '../../../types/benutzer-rolle-do.class';
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

export const NOTIFICATION_DELETE_BENUTZER = 'benutzer_overview_delete';

@Component({
  selector:    'bla-benutzer-overview',
  templateUrl: './benutzer-overview.component.html',
  styleUrls:   ['./benutzer-overview.component.scss']
})
export class BenutzerOverviewComponent extends CommonComponent implements OnInit {

  public config = BENUTZER_OVERVIEW_CONFIG;
  public rows: TableRow[];

  constructor(private benutzerDataProvider: BenutzerDataProviderService, private router: Router, private notificationService: NotificationService) {
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
      id:               NOTIFICATION_DELETE_BENUTZER + id,
      title:            'MANAGEMENT.BENUTZER.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.BENUTZER.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_BENUTZER + id)
        .subscribe(myNotification => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.benutzerDataProvider.deleteById(id)
                .then(response => this.loadTableRows())
                .catch(response => this.rows = hideLoadingIndicator(this.rows, id));
          }
        });

    this.notificationService.showNotification(notification);

  }

  private loadTableRows() {
    this.loading = true;

    this.benutzerDataProvider.findAll()
        .then((response: BogenligaResponse<BenutzerRolleDO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<BenutzerRolleDO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/benutzer/' + versionedDataObject.id);
  }

  private handleLoadTableRowsFailure(response: BogenligaResponse<BenutzerRolleDO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<BenutzerRolleDO[]>): void {
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }
}
