import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {
  CommonComponentDirective,
  hideLoadingIndicator,
  showDeleteLoadingIndicatorIcon,
  toTableRows
} from '@shared/components';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {BogenligaResponse} from '@shared/data-provider';
import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction,
  CurrentUserService,
  OnOfflineService
} from '@shared/services';
import {LigaDataProviderService} from '@verwaltung/services/liga-data-provider.service';
import {LigaDTO} from '@verwaltung/types/datatransfer/liga-dto.class';
import {LIGA_OVERVIEW_CONFIG} from './liga-overview.config';
import {SessionHandling} from '@shared/event-handling';
import {UserDataProviderService} from '@verwaltung/services/user-data-provider.service';
import {UserRolleDO} from '@verwaltung/types/user-rolle-do.class';

export const NOTIFICATION_DELETE_LIGA = 'liga_overview_delete';

@Component({
  selector:    'bla-liga-overview',
  templateUrl: './liga-overview.component.html',
  styleUrls:   ['./liga-overview.component.scss']
})
export class LigaOverviewComponent extends CommonComponentDirective implements OnInit {

  public config = LIGA_OVERVIEW_CONFIG;
  public rows: TableRow[];
  public searchTerm = 'searchTermLiga';

  private sessionHandling: SessionHandling;

  constructor(
    private userDataProviderService: UserDataProviderService,
    private ligaDataProvider: LigaDataProviderService,
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
        .then((response: BogenligaResponse<LigaDTO[]>) => {
          this.userDataProviderService.findUserRoleById(this.currentUserService.getCurrentUserID()).then((roleresponse: BogenligaResponse<UserRolleDO[]>) => {
            if (roleresponse.payload.filter(role => role.roleName == 'ADMIN').length > 0 || roleresponse.payload.filter(role => role.roleName == 'LIGALEITER').length > 0) {
              this.handleLoadTableRowsSuccess(response);
            } else {
              let filtered = response.payload.filter(ligadto => {
                if (ligadto.ligaVerantwortlichMail == this.currentUserService.getEmail())
                  return true;
                return false;
              })
              this.handleLoadTableRows(filtered);
            }
          });
        })
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

  private handleLoadTableRows(response: LigaDTO[]): void {
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response);
    this.loading = false;
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/liga/' + versionedDataObject.id);
  }


}
