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
import {DsbMitgliedDataProviderService} from '../../../services/dsb-mitglied-data-provider.service';
import {DsbMitgliedDTO} from '../../../types/datatransfer/dsb-mitglied-dto.class';
import {DSB_MITGLIED_OVERVIEW_CONFIG} from './dsb-mitglied-overview.config';
import {CurrentUserService, OnOfflineService, UserPermission} from '@shared/services';
import {SessionHandling} from '@shared/event-handling';

export const NOTIFICATION_DELETE_DSB_MITGLIED = 'dsb_mitglied_overview_delete';

@Component({
  selector: 'bla-dsb-mitglied-overview',
  templateUrl: './dsb-mitglied-overview.component.html',
  styleUrls: ['./dsb-mitglied-overview.component.scss']
})
export class DsbMitgliedOverviewComponent extends CommonComponentDirective implements OnInit {

  public config = DSB_MITGLIED_OVERVIEW_CONFIG;
  public rows: TableRow[];
  public searchTerm = 'searchTermMitglied';
  private sessionHandling: SessionHandling;

  constructor(private dsbMitgliedDataProvider: DsbMitgliedDataProviderService,
    private router: Router,
    private notificationService: NotificationService,
    private currentUserService: CurrentUserService,
    private onOfflineService: OnOfflineService) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);
  }

  ngOnInit() {
    this.loading = true;
    if (!localStorage.getItem(this.searchTerm)) {
      this.loadTableRows();
    }
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
      id: NOTIFICATION_DELETE_DSB_MITGLIED + id,
      title: 'MANAGEMENT.DSBMITGLIEDER.NOTIFICATION.DELETE.TITLE',
      description: 'MANAGEMENT.DSBMITGLIEDER.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity: NotificationSeverity.QUESTION,
      origin: NotificationOrigin.USER,
      type: NotificationType.YES_NO,
      userAction: NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_DSB_MITGLIED + id)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.dsbMitgliedDataProvider.deleteById(id)
                .then((response) => this.loadTableRows())
                .catch((response) => this.rows = hideLoadingIndicator(this.rows, id));
          } else if (myNotification.userAction === NotificationUserAction.DECLINED) {
            this.rows = hideLoadingIndicator(this.rows, id);
          }
        });

    this.notificationService.showNotification(notification);

  }

  public findBySearch($event: string) {
    this.dsbMitgliedDataProvider.findBySearch($event)
        .then((response: BogenligaResponse<DsbMitgliedDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<DsbMitgliedDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private loadTableRows() {
    this.dsbMitgliedDataProvider.findAll()
        .then((response: BogenligaResponse<DsbMitgliedDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<DsbMitgliedDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/dsbmitglieder/' + versionedDataObject.id);
  }

  private handleLoadTableRowsFailure(response: BogenligaResponse<DsbMitgliedDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<DsbMitgliedDTO[]>): void {
    if (this.currentUserService.hasPermission(UserPermission.CAN_MODIFY_VEREIN_DSBMITGLIEDER)) {
      response.payload = response.payload.filter((entry) => this.currentUserService.getVerein() === entry.vereinsId);
    }
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }
}
