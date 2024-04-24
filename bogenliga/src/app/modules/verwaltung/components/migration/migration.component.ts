import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ButtonType, CommonComponentDirective, toTableRows} from '../../../shared/components';
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
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';

export const NOTIFICATION_DELETE_MIGRATION = 'migration_delete';
const ID_PATH_PARAM = 'id';
let offsetMultiplicator = 0;
export {offsetMultiplicator};
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
  public isFiltered = false;
  public buttonColor = ActionButtonColors.PRIMARY;
  public searchTerm = 'searchTermMigration';
  private sessionHandling: SessionHandling;
  public currentStatus: string = "ERROR";
  public statusArray: Array<string> = ["ERROR", "SUCCESS", "IN_PROGRESS", "NEW"];
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
      this.notificationService.showNotification({
        id:          'Migrationslauf starten?',
        description: 'Möchten Sie die Migration manuell starten?',
        title:       'Migration starten',
        origin:      NotificationOrigin.SYSTEM,
        type:        NotificationType.YES_NO,
        severity:    NotificationSeverity.QUESTION,
      });

      this.notificationService.observeNotification('Migrationslauf starten?')
          .subscribe((myNotification) => {
            if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
              this.MigrationDataProvider.startMigration();
            } else {
              this.notificationService.showNotification({
                id: 'Migration abgebrochen',
                description: 'Die Migration wurde abgebrochen.',
                title: 'Migration abgebrochen',
                origin: NotificationOrigin.SYSTEM,
                userAction: NotificationUserAction.ACCEPTED,
                type: NotificationType.OK,
                severity: NotificationSeverity.INFO
              });
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
    //TODO
    if(offsetMultiplicator === 0){
      return;
    }
    else {
      offsetMultiplicator--;
    }
  }
  public nextPageButton(){
    //TODO
    offsetMultiplicator++;
  }
  filterUnsuccessful() {
    try {
      if(this.isFiltered){
        this.MigrationDataProvider.findAll()
            .then((response: BogenligaResponse<TriggerDTO[]>) => {
              this.handleLoadTableRowsSuccess(response);
              console.log(response);
            })
            .catch((response: BogenligaResponse<TriggerDTO[]>) => this.handleLoadTableRowsFailure(response));
        this.buttonColor = ActionButtonColors.PRIMARY;
        this.isFiltered = false;
      }
      else{
        switch(this.currentStatus) {
          case "ERROR":
            this.MigrationDataProvider.findErrors()
                .then((response: BogenligaResponse<TriggerDTO[]>) => {
                  this.handleLoadTableRowsSuccess(response);
                  console.log(response);
                })
                .catch((response: BogenligaResponse<TriggerDTO[]>) => this.handleLoadTableRowsFailure(response));
            this.buttonColor = ActionButtonColors.SECONDARY;
            this.isFiltered = true;
            break;
          case "SUCCESS":
            this.MigrationDataProvider.findSuccessed()
                .then((response: BogenligaResponse<TriggerDTO[]>) => {
                  this.handleLoadTableRowsSuccess(response);
                  console.log(response);
                })
                .catch((response: BogenligaResponse<TriggerDTO[]>) => this.handleLoadTableRowsFailure(response));
            this.buttonColor = ActionButtonColors.SECONDARY;
            this.isFiltered = true;
            break;
          case "IN_PROGRESS":
            this.MigrationDataProvider.findInProgress()
                .then((response: BogenligaResponse<TriggerDTO[]>) => {
                  this.handleLoadTableRowsSuccess(response);
                  console.log(response);
                })
                .catch((response: BogenligaResponse<TriggerDTO[]>) => this.handleLoadTableRowsFailure(response));
            this.buttonColor = ActionButtonColors.SECONDARY;
            this.isFiltered = true;
            break;
          case "NEW":
            this.MigrationDataProvider.findNews()
                .then((response: BogenligaResponse<TriggerDTO[]>) => {
                  this.handleLoadTableRowsSuccess(response);
                  console.log(response);
                })
                .catch((response: BogenligaResponse<TriggerDTO[]>) => this.handleLoadTableRowsFailure(response));
            this.buttonColor = ActionButtonColors.SECONDARY;
            this.isFiltered = true;
            break;
          default:
            console.log('ERROR WHILE SELECTING STATUS')
            break;
        }
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
    console.log('Status switched to ' + this.currentStatus)
    if(this.isFiltered){
      this.isFiltered = false
      this.filterUnsuccessful()
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
