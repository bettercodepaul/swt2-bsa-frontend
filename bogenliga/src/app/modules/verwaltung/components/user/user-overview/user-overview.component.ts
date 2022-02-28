import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonComponentDirective} from '@shared/components';
import {hideLoadingIndicator, showDeleteLoadingIndicatorIcon, toTableRows} from '../../../../shared/components/tables';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {BogenligaResponse} from '@shared/data-provider';
import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../../shared/services/notification';
import {UserDataProviderService} from '../../../services/user-data-provider.service';
import {UserRolleDO} from '../../../types/user-rolle-do.class';
import {USER_OVERVIEW_CONFIG_ACTIVE} from '@verwaltung/components/user/user-overview/user-overview-active.config';
import {UserRolleDTO} from '@verwaltung/types/datatransfer/user-rolle-dto.class';

export const NOTIFICATION_DELETE_USER = 'user_overview_delete';

@Component({
  selector:    'bla-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrls:   ['./user-overview.component.scss']
})
export class UserOverviewComponent extends CommonComponentDirective implements OnInit {

  public configActive = USER_OVERVIEW_CONFIG_ACTIVE;
  public rowsActive: TableRow[];
  public displayRoles: TableRow[];
  public searchTerm = 'searchTermUser';

  constructor(private userDataProvider: UserDataProviderService, private router: Router, private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.loading = true;
    if (!localStorage.getItem(this.searchTerm)) {
      this.loadTableRows();
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

    this.rowsActive = showDeleteLoadingIndicatorIcon(this.rowsActive, id);

    const notification: Notification = {
      id:               NOTIFICATION_DELETE_USER + id,
      title:            'MANAGEMENT.USER.NOTIFICATION.DELETE.TITLE',
      description:      'MANAGEMENT.USER.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity:         NotificationSeverity.QUESTION,
      origin:           NotificationOrigin.USER,
      type:             NotificationType.YES_NO,
      userAction:       NotificationUserAction.PENDING
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_USER + id)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.userDataProvider.deleteById(id)
                .then((response) => this.loadTableRows())
                .catch((response) => this.rowsActive = hideLoadingIndicator(this.rowsActive, id));
          } else if (myNotification.userAction === NotificationUserAction.DECLINED) {
            this.rowsActive = hideLoadingIndicator(this.rowsActive, id);
          }
        });

    this.notificationService.showNotification(notification);

  }

  public findBySearch($event: string) {
    this.userDataProvider.findBySearch($event)
      .then((response: BogenligaResponse<UserRolleDO[]>) => this.handleLoadTableRowsSuccess(response))
      .catch((response: BogenligaResponse<UserRolleDO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private loadTableRows() {
    this.userDataProvider.findAll()
        .then((response: BogenligaResponse<UserRolleDO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<UserRolleDO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/user/' + versionedDataObject.id);
  }

  private handleLoadTableRowsFailure(response: BogenligaResponse<UserRolleDO[]>): void {
    this.rowsActive = [];
    this.loading = false;
  }

  /*
  handleLoadTableRowsSuccess
  displayRoles wurden oben angelegt.
  ich hole mir aus der Datenbank alle aktiven Nutzer.
  Für die Anzeige schreibe ich jeden Nutzer in displayRoles, falls ein User doppelt vorkommen würde,
  zeige ich nur die Rolle mit dem höchsten Rang an.
  */
  private handleLoadTableRowsSuccess(response: BogenligaResponse<UserRolleDO[]>): void {
    this.rowsActive = []; // reset array to ensure change detection
    this.displayRoles = [];

    let exist = 0;
    this.rowsActive = toTableRows(response.payload.filter((user) => user.active));
    this.rowsActive.forEach((item, index) => {
      this.displayRoles.forEach((item2, index2) => {
        if (item.payload.id === item2.payload.id) {
          exist = 1;
        }
      });
      if (exist === 0) {
        this.displayRoles.push(item);
      } else {
        exist = 0;
      }
    });
    this.loading = false;
  }
}
