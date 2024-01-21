import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ButtonType,
  CommonComponentDirective,
  hideLoadingIndicator,
  showDeleteLoadingIndicatorIcon, toTableRows
} from '../../../shared/components';
import {BogenligaResponse} from '../../../shared/data-provider';
import {
  Notification,
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../../shared/services/notification';
import {SyncDataProviderService} from '../../services/sync-data-provider.service';

import {SYNC_OVERVIEW_CONFIG} from './syncdaten.config';
import {UserProfileDataProviderService} from '@user/services/user-profile-data-provider.service';
import {SessionHandling} from '@shared/event-handling';
import {CurrentUserService, OnOfflineService} from '@shared/services';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';
import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';
import {TriggerDTO} from '@verwaltung/types/datatransfer/trigger-dto.class';
import {TableRow} from '@shared/components/tables/types/table-row.class';

export const NOTIFICATION_DELETE_SYNCDATEN = 'syncdaten_delete';
const ID_PATH_PARAM = 'id';

@Component({
  selector:    'bla-daten-detail',
  templateUrl: './syncdaten.component.html',
  styleUrls:   ['./syncdaten.component.scss']
})
export class SyncdatenComponent extends CommonComponentDirective implements OnInit {
  public rows: TableRow[];
  public config = SYNC_OVERVIEW_CONFIG;
  public ButtonType = ButtonType;
  public deleteLoading = false;
  public saveLoading = false;
  public searchTerm = 'searchTermSync';
  public id;


  private sessionHandling: SessionHandling;

  public ActionButtonColors = ActionButtonColors;


  constructor(private SyncdatenDataProvider: SyncDataProviderService,
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
    console.log("gnaha");
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
    console.log("hahaha");
    this.SyncdatenDataProvider.findAll()
        .then((response: BogenligaResponse<TriggerDTO[]>) => {
          this.handleLoadTableRowsSuccess(response);
        })
        .catch((response: BogenligaResponse<TriggerDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  public startSync() {
    this.SyncdatenDataProvider.startSync();
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
