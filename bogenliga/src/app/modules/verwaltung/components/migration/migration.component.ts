import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ButtonType, CommonComponentDirective, toTableRows} from '@shared/components';
import {BogenligaResponse} from '@shared/data-provider';
import {
  NotificationOrigin,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '@shared/services';
import {MigrationProviderService} from '../../services/migration-data-provider.service';

import {MIGRATION_OVERVIEW_CONFIG} from './migration.config';
import {UserProfileDataProviderService} from '@user/services/user-profile-data-provider.service';
import {SessionHandling} from '@shared/event-handling';
import {CurrentUserService, OnOfflineService} from '@shared/services';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';
import {TriggerDTO} from '@verwaltung/types/datatransfer/trigger-dto.class';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {FilterinputbarComponent} from '@shared/components/selectionlists/filterinputbar/filterinputbar.component';

export const NOTIFICATION_DELETE_MIGRATION = 'migration_delete';
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
  private sessionHandling: SessionHandling;
  public currentStatus: string = "Fehlgeschlagen";
  public statusArray: Array<string> = ["Fehlgeschlagen", "Erfolgreich", "Laufend", "Neu", "Alle"];
  public ActionButtonColors = ActionButtonColors;
  public offsetMultiplictor = 0;
  public queryPageLimit = 500;

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
    this.MigrationDataProvider.findErrors(this.offsetMultiplictor,this.queryPageLimit)
        .then((response: BogenligaResponse<TriggerDTO[]>) => {
          this.handleLoadTableRowsSuccess(response);
          console.log(response);
        })
        .catch((response: BogenligaResponse<TriggerDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  public startMigration() {

    try {
      this.notificationService.showNotification({
        id:          'Migrationslauf starten?',
        description: 'Möchten Sie die Migration manuell starten?',
        title:       'Migration starten',
        origin:      NotificationOrigin.SYSTEM,
        type:        NotificationType.YES_NO,
        severity:    NotificationSeverity.QUESTION,
        userAction: NotificationUserAction.PENDING
      });

      this.notificationService.observeNotification('Migrationslauf starten?')
          .subscribe((myNotification) => {
            if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
              this.MigrationDataProvider.startMigration();
            }
          });
    } catch (e) {
      this.notificationService.showNotification({
        id: 'Fehler beim Starten der Migration',
        description: 'Ein Fehler ist aufgetreten und die Migration wurde nicht gestartet.',
        title: 'Fehler beim Start der Migration',
        origin: NotificationOrigin.SYSTEM,
        userAction: NotificationUserAction.ACCEPTED,
        type: NotificationType.OK,
        severity: NotificationSeverity.INFO
      });
    }
  }
  public previousPageButton(){
    if(this.offsetMultiplictor > 0){
      this.offsetMultiplictor--;
    }
    this.filterForStatus(this.offsetMultiplictor,this.queryPageLimit)
  }
  public nextPageButton(){
    this.offsetMultiplictor++;
    this.filterForStatus(this.offsetMultiplictor,this.queryPageLimit)
  }
  filterForStatus(multiplicator: number,pagelimit: number) {
    try {
        switch(this.currentStatus) {
          case "Fehlgeschlagen":
            this.MigrationDataProvider.findErrors(multiplicator,pagelimit)
                .then((response: BogenligaResponse<TriggerDTO[]>) => {
                  this.handleLoadTableRowsSuccess(response);
                  console.log(response);
                })
                .catch((response: BogenligaResponse<TriggerDTO[]>) => this.handleLoadTableRowsFailure(response));
            break;
          case "Alle":
            this.MigrationDataProvider.findAllWithPages(multiplicator,pagelimit)
                .then((response: BogenligaResponse<TriggerDTO[]>) => {
                  this.handleLoadTableRowsSuccess(response);
                  console.log(response);
                })
                .catch((response: BogenligaResponse<TriggerDTO[]>) => this.handleLoadTableRowsFailure(response));
            break;
          case "Erfolgreich":
            this.MigrationDataProvider.findSuccessed(multiplicator,pagelimit)
                .then((response: BogenligaResponse<TriggerDTO[]>) => {
                  this.handleLoadTableRowsSuccess(response);
                  console.log(response);
                })
                .catch((response: BogenligaResponse<TriggerDTO[]>) => this.handleLoadTableRowsFailure(response));
            break;
          case "Laufend":
            this.MigrationDataProvider.findInProgress(multiplicator,pagelimit)
                .then((response: BogenligaResponse<TriggerDTO[]>) => {
                  this.handleLoadTableRowsSuccess(response);
                  console.log(response);
                })
                .catch((response: BogenligaResponse<TriggerDTO[]>) => this.handleLoadTableRowsFailure(response));
            break;
          case "Neu":
            this.MigrationDataProvider.findNews(multiplicator,pagelimit)
                .then((response: BogenligaResponse<TriggerDTO[]>) => {
                  this.handleLoadTableRowsSuccess(response);
                  console.log(response);
                })
                .catch((response: BogenligaResponse<TriggerDTO[]>) => this.handleLoadTableRowsFailure(response));
            break;
          default:
            console.log('ERROR WHILE SELECTING STATUS')
            break;
      }
    } catch (e) {
      this.notificationService.showNotification({
        id: 'Fehler beim Starten der Filterung',
        description: 'Ein Fehler ist aufgetreten und die Filterung konnte nicht gestartet werden.',
        title: 'Fehler beim Start der Filterung',
        origin: NotificationOrigin.SYSTEM,
        userAction: NotificationUserAction.ACCEPTED,
        type: NotificationType.OK,
        severity: NotificationSeverity.INFO
      });
    }
  }
  selectFilterForStatus(){
    this.currentStatus = FilterinputbarComponent.currentItem
    console.log('Status switched to ' + this.currentStatus + ' and resetet OffsetMultiplicator')
    this.queryPageLimit= 500;
    this.offsetMultiplictor=0;
    this.filterForStatus(this.offsetMultiplictor,this.queryPageLimit)
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
