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
import {VeranstaltungDataProviderService} from '../../../services/veranstaltung-data-provider.service';
import {VeranstaltungDTO} from '../../../types/datatransfer/veranstaltung-dto.class';
import {VeranstaltungDO} from '../../../types/veranstaltung-do.class';
import {VERANSTALTUNG_OVERVIEW_CONFIG} from './veranstaltung-overview.config';
import {NOTIFICATION_DELETE_LIGA} from '@verwaltung/components/liga/liga-overview/liga-overview.component';
import {CurrentUserService, UserPermission} from '@shared/services';

export const NOTIFICATION_DELETE_VERANSTALTUNG = 'veranstaltung_overview_delete';

@Component({
  selector:    'bla-veranstaltung-overview',
  templateUrl: './veranstaltung-overview.component.html',
  styleUrls:   ['./veranstaltung-overview.component.scss']
})
export class VeranstaltungOverviewComponent extends CommonComponent implements OnInit {

  public config = VERANSTALTUNG_OVERVIEW_CONFIG;
  public rows: TableRow[];


  constructor(private veranstaltungDataProvider: VeranstaltungDataProviderService, private router: Router, private notificationService: NotificationService,private currentUserService: CurrentUserService) {
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
      title:            'MANAGEMENT.VERANSTALTUNG.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.VERANSTALTUNG.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_LIGA + id)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.veranstaltungDataProvider.deleteById(id)
                .then((response) => this.loadTableRows())
                .catch((response) => this.rows = hideLoadingIndicator(this.rows, id));
          } else if (myNotification.userAction === NotificationUserAction.DECLINED) {
            this.rows = hideLoadingIndicator(this.rows, id);
          }
        });

    this.notificationService.showNotification(notification);
  }

  private loadTableRows() {
    this.loading = true;
    this.veranstaltungDataProvider.findAll()
        .then((response: BogenligaResponse<VeranstaltungDO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<VeranstaltungDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private handleLoadTableRowsFailure(response: BogenligaResponse<VeranstaltungDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<VeranstaltungDO[]>): void {
    if(this.currentUserService.hasPermission(UserPermission.CAN_MODIFY_MY_VERANSTALTUNG)){
      response.payload =response.payload.filter((entry)=>{return this.currentUserService.hasVeranstaltung(entry.id)});
    console.log("detected");}
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/veranstaltung/' + versionedDataObject.id);
  }


}
