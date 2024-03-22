import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ButtonType,
  CommonComponentDirective, toTableRows
} from '../../../shared/components';
import {BogenligaResponse} from '../../../shared/data-provider';
import {
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../shared/services/notification';
import {MigrationProviderService} from '../../services/migration-data-provider.service';

import {MIGRATION_OVERVIEW_CONFIG} from './migration.config';
import {UserProfileDataProviderService} from '@user/services/user-profile-data-provider.service';
import {SessionHandling} from '@shared/event-handling';
import {CurrentUserService, OnOfflineService} from '@shared/services';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';
import {TriggerDTO} from '@verwaltung/types/datatransfer/trigger-dto.class';
import {TableRow} from '@shared/components/tables/types/table-row.class';

export const NOTIFICATION_DELETE_MIGRATION = 'migration_delete';
const ID_PATH_PARAM = 'id';

@Component({
  selector:    'bla-daten-detail',
  templateUrl: './migration.component.html',
  styleUrls:   ['./migration.component.scss']
})
export class MigrationComponent extends CommonComponentDirective implements OnInit {
  public rows: TableRow[];
  public config = MIGRATION_OVERVIEW_CONFIG;
  public ButtonType = ButtonType;
  public deleteLoading = false;
  public saveLoading = false;
  public searchTerm = 'searchTermMigration';
  public id;


  private sessionHandling: SessionHandling;

  public ActionButtonColors = ActionButtonColors;


  constructor(private MigrationDataProvider: MigrationProviderService,
    private userProvider: UserProfileDataProviderService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private currentUserService: CurrentUserService,
    private onOfflineService: OnOfflineService) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);
  }

  ngOnInit() {
    this.loading = true;
    this.loadTableRows();
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


  private loadTableRows() {
    this.MigrationDataProvider.findAll()
        .then((response: BogenligaResponse<TriggerDTO[]>) => {
          this.handleLoadTableRowsSuccess(response);
          console.log(response);
        })
        .catch((response: BogenligaResponse<TriggerDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  public startMigration() {
    try {
      this.MigrationDataProvider.startMigration();
      this.notificationService.showNotification({
        id: 'Migrationslauf gestartet',
        description: 'Die Migration wurde angestoßen und läuft',
        title: 'Migration gestartet',
        origin: NotificationOrigin.SYSTEM,
        userAction: NotificationUserAction.ACCEPTED,
        type: NotificationType.OK,
        severity: NotificationSeverity.INFO
      });
    } catch (e) {

    this.notificationService.showNotification({
      id: 'Fehler beim Starten der Migration',
      description: 'Ein fehler ist aufgetreten und die Migration wurde nicht gestartet.',
      title: 'Fehler beim Start der MIgration',
      origin: NotificationOrigin.SYSTEM,
      userAction: NotificationUserAction.ACCEPTED,
      type: NotificationType.OK,
      severity: NotificationSeverity.INFO
    });

  }
}

  private handleLoadTableRowsFailure(response: BogenligaResponse<TriggerDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<TriggerDTO[]>): void {
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }

}
