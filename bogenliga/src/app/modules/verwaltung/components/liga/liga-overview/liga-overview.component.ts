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
import {LigaDataProviderService} from '../../../services/liga-data-provider.service';
import {LigaDTO} from '../../../types/datatransfer/liga-dto.class';
import {LIGA_OVERVIEW_CONFIG} from './liga-overview.config';

export const NOTIFICATION_DELETE_LIGA = 'liga_overview_delete';

@Component({
  selector: 'bla-liga-overview',
  templateUrl: './liga-overview.component.html',
  styleUrls: ['./liga-overview.component.scss']
})
export class LigaOverviewComponent extends CommonComponentDirective implements OnInit {

  public config = LIGA_OVERVIEW_CONFIG;
  public rows: TableRow[];
  public searchTerm = 'searchTermLiga';


  constructor(private ligaDataProvider: LigaDataProviderService, private router: Router, private notificationService: NotificationService) {
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
      id:               NOTIFICATION_DELETE_LIGA + id,
      title:            'MANAGEMENT.LIGA.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.LIGA.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_LIGA + id)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.ligaDataProvider.deleteById(id)
                .then((response) => this.loadTableRows())
                .catch((response) => this.rows = hideLoadingIndicator(this.rows, id));
          } else if (myNotification.userAction === NotificationUserAction.DECLINED) {
            this.rows = hideLoadingIndicator(this.rows, id);
          }
        });

    this.notificationService.showNotification(notification);
  }

  private loadTableRows() {
    this.ligaDataProvider.findAll()
        .then((response: BogenligaResponse<LigaDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<LigaDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  public findBySearch($event: string) {
    this.ligaDataProvider.findBySearch($event)
        .then((response: BogenligaResponse<LigaDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<LigaDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private handleLoadTableRowsFailure(response: BogenligaResponse<LigaDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<LigaDTO[]>): void {
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/liga/' + versionedDataObject.id);
  }


}
