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
import {VereinDataProviderService} from '../../../services/verein-data-provider.service';
import {VereinDTO} from '../../../types/datatransfer/verein-dto.class';
import {VEREIN_OVERVIEW_CONFIG} from './verein-overview.config';

export const NOTIFICATION_DELETE_VEREINE = 'vereine_overview_delete';

@Component({
  selector: 'bla-verein-overview',
  templateUrl: './verein-overview.component.html',
  styleUrls: ['./verein-overview.component.scss']
})
export class VereinOverviewComponent extends CommonComponentDirective implements OnInit {

  public config = VEREIN_OVERVIEW_CONFIG;
  public rows: TableRow[];
  public searchTerm = 'searchTermVereine';

  constructor(private vereinDataProvider: VereinDataProviderService, private router: Router, private notificationService: NotificationService) {
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
      id:               NOTIFICATION_DELETE_VEREINE + id,
      title:            'MANAGEMENT.VEREINE.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.VEREINE.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_VEREINE + id)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.vereinDataProvider.deleteById(id)
                .then((response) => this.loadTableRows())
                .catch((response) => this.rows = hideLoadingIndicator(this.rows, id));
          } else if (myNotification.userAction === NotificationUserAction.DECLINED) {
            this.rows = hideLoadingIndicator(this.rows, id);
          }
        });

    this.notificationService.showNotification(notification);

  }

  private loadTableRows() {
    this.vereinDataProvider.findAll()
        .then((response: BogenligaResponse<VereinDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<VereinDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  public findBySearch($event: string) {
    this.vereinDataProvider.findBySearch($event)
        .then((response: BogenligaResponse<VereinDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<VereinDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/vereine/' + versionedDataObject.id);
  }

  private handleLoadTableRowsFailure(response: BogenligaResponse<VereinDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<VereinDTO[]>): void {
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }

}
