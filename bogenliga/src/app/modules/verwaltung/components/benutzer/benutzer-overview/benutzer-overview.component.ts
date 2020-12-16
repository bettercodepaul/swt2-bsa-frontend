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
import {BenutzerDataProviderService} from '../../../services/benutzer-data-provider.service';
import {BenutzerRolleDO} from '../../../types/benutzer-rolle-do.class';
import {BENUTZER_OVERVIEW_CONFIG_ACTIVE} from '@verwaltung/components/benutzer/benutzer-overview/benutzer-overview-active.config';

export const NOTIFICATION_DELETE_BENUTZER = 'benutzer_overview_delete';

@Component({
  selector:    'bla-benutzer-overview',
  templateUrl: './benutzer-overview.component.html',
  styleUrls:   ['./benutzer-overview.component.scss']
})
export class BenutzerOverviewComponent extends CommonComponentDirective implements OnInit {

  public configActive = BENUTZER_OVERVIEW_CONFIG_ACTIVE;
  public rowsActive: TableRow[];
  public displayRoles: TableRow[];

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

    this.rowsActive = showDeleteLoadingIndicatorIcon(this.rowsActive, id);

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
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.benutzerDataProvider.deleteById(id)
                .then((response) => this.loadTableRows())
                .catch((response) => this.rowsActive = hideLoadingIndicator(this.rowsActive, id));
          } else if (myNotification.userAction === NotificationUserAction.DECLINED) {
            this.rowsActive = hideLoadingIndicator(this.rowsActive, id);
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
    this.rowsActive = [];
    this.loading = false;
  }

  /*
  handleLoadTableRowsSuccess
  displayRoles wurden oben angelegt.
  ich hole mir aus der Datenbank alle aktiven Nutzer.
  Für die Anzeige schreibe ich jeden Nutzer in displayRoles, falls ein Benutzer doppelt vorkommen würde,
  zeige ich nur die Rolle mit dem höchsten Rang an.
  */
  private handleLoadTableRowsSuccess(response: BogenligaResponse<BenutzerRolleDO[]>): void {
    this.rowsActive = []; // reset array to ensure change detection
    this.displayRoles = [];

    let exist = 0;
    this.rowsActive = toTableRows(response.payload.filter((benutzer) => benutzer.active));
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
