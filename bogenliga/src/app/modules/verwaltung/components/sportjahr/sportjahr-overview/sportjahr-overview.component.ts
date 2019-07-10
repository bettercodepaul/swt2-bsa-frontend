import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonComponent} from '../../../../shared/components/common';
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
import {SportjahrDataProviderService} from '../../../services/sportjahr-data-provider.service';
import {SportjahrDTO} from '../../../types/datatransfer/sportjahr-dto.class';
import {SPORTJAHR_OVERVIEW_CONFIG} from './sportjahr-overview.config';
import {NOTIFICATION_DELETE_LIGA} from '@verwaltung/components/liga/liga-overview/liga-overview.component';

export const NOTIFICATION_DELETE_SPORTJAHR = 'sportjahr_overview_delete';

@Component({
  selector:    'bla-sportjahr-overview',
  templateUrl: './sportjahr-overview.component.html',
  styleUrls:   ['./sportjahr-overview.component.scss']
})
export class SportjahrOverviewComponent extends CommonComponent implements OnInit {

  public config = SPORTJAHR_OVERVIEW_CONFIG;
  public rows: TableRow[];


  constructor(private sportjahrDataProvider: SportjahrDataProviderService, private router: Router, private notificationService: NotificationService) {
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
      id:               NOTIFICATION_DELETE_LIGA + id,
      title:            'MANAGEMENT.SPORTJAHR.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.SPORTJAHR.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_LIGA + id)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.sportjahrDataProvider.deleteById(id)
                .then((response) => this.loadTableRows())
                .catch((response) => this.rows = hideLoadingIndicator(this.rows, id));
          }
        });

    this.notificationService.showNotification(notification);
  }

  private loadTableRows() {
    this.loading = true;

    this.sportjahrDataProvider.findAllByLigaId(this.id)
        .then((response: BogenligaResponse<SportjahrDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<SportjahrDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private handleLoadTableRowsFailure(response: BogenligaResponse<SportjahrDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<SportjahrDTO[]>): void {
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/sportjahr/' + versionedDataObject.id);
  }


}
