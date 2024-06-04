import {Component, Input, OnInit, ViewChild, AfterViewInit} from '@angular/core';
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
import {TriggerCountDO} from '@verwaltung/types/trigger-count-do-class';
import {TriggerCountDTO} from '@verwaltung/types/datatransfer/trigger-count-dto-class';
import {StatusbarComponent} from '@shared/components/statusbars';
import {OverviewDialogComponent} from '../../../shared/components';
import {FilterinputbarComponent} from '@shared/components/selectionlists/filterinputbar/filterinputbar.component';
import {
  FilterTimestampInputbarComponent
} from '@shared/components/selectionlists/filterTimestampInputbar/filterTimestampInputbar.component';
import {Migration} from '@angular/cdk/schematics';


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
  public id;
  public countObj: TriggerCountDTO;
  public inprogressObj: TriggerCountDTO;
  public migrationCompleted = false;
  public progress = 0;
  public succeededCount:number;
  public entireCount:number;
  private sessionHandling: SessionHandling;
  public currentStatus: string = "Fehlgeschlagen";
  public statusArray: Array<string> = ["Fehlgeschlagen", "Erfolgreich", "Laufend", "Neu", "Alle"];
  public currentTimestamp: string = "letzter Monat";
  public timestampArray: Array<string> = ["letzter Monat", "letzten drei Monate", "letzten sechs Monate", "im letzten Jahr", "alle"];
  public ActionButtonColors = ActionButtonColors;
  public timestampDropdownLable = "Zeitstempel";
  public filterDropdownLable ="Status";
  public cypressTagStatus ="status-filter-selection";
  public cypressTagTimestamp = "timestamp-filter-selection";
  public offsetMultiplictor = 0;
  public queryPageLimit = 500;
  public inProgressCount:number;
  public isMigrationRunning:boolean = false;


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
  @ViewChild(StatusbarComponent) statusbar: StatusbarComponent;
  @ViewChild(OverviewDialogComponent) overviewDialog: OverviewDialogComponent;

  ngOnInit() {
    this.loading = true;
    this.loadTableRows();
    if (!localStorage.getItem(this.searchTerm)) {
      this.loadTableRows();
    }
  }


  ngAfterViewInit() {
    this.getInProgressDataCount((count) => {
      if (count > 0) {
        this.gatherMigrationStatus();
      }
    });
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
    this.MigrationDataProvider.findErrors(this.offsetMultiplictor,this.queryPageLimit,this.currentTimestamp)
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
              this.gatherMigrationStatus();
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

public getEntireDataCount(){
    this.MigrationDataProvider.getEntireDataCount()
      .then((response: BogenligaResponse<TriggerCountDO>) => {
        this.handleEntireData(response);
        console.log(this.entireCount);
      })
      .catch((response: BogenligaResponse<TriggerDTO[]>) => this.handleLoadTableRowsFailure(response));
}
public getSucceededDataCount(){
  this.MigrationDataProvider.getSucceededDataCount()
      .then((response: BogenligaResponse<TriggerCountDO>) => {
        this.handleSucceeededData(response);
        console.log(this.succeededCount);
      })
      .catch((response: BogenligaResponse<TriggerDTO[]>) => this.handleLoadTableRowsFailure(response));
}

  public getInProgressDataCount(callback: (count: number) => void) {
    this.MigrationDataProvider.getInProgressDataCount()
        .then((response: BogenligaResponse<TriggerCountDO>) => {
          this.handleInProgressData(response);
          callback(this.inProgressCount);
        })
  }

  public gatherMigrationStatus() {

    this.statusbar.hidden = false;

    let firstRound = true
    this.getEntireDataCount();

    this.progress = 0;
    const checkProgress = () => {
      try {
        if (this.progress != 100) {
          this.getSucceededDataCount();
          if (!isNaN(this.succeededCount) && !isNaN(this.entireCount)) {
            let progress = (this.succeededCount/ this.entireCount) * 100;
            this.progress = Math.round(progress * 10) / 10;
            this.statusbar.progress = this.progress;
          } else {
            this.progress = 0;
            this.statusbar.progress = this.progress;
          }

          // Schedule the next check
          setTimeout(checkProgress, 5000);
        } else {
          this.notificationService.showNotification({
            id: 'Migration wurde abgeschlossen',
            description: 'Die Migration wurde erfolgreich beendet.',
            title: 'Migration abgeschlossen',
            origin: NotificationOrigin.SYSTEM,
            userAction: NotificationUserAction.ACCEPTED,
            type: NotificationType.OK,
            severity: NotificationSeverity.INFO
          });
          this.migrationCompleted = true;
        }
      } catch (e) {
        console.error('Daten konnten nicht erhalten werden:', e);
      }
    };

    // Start the first check
    checkProgress();
  }

  public previousPageButton(){
    if(this.offsetMultiplictor > 0){
      this.offsetMultiplictor--;
    }
    const element = document.getElementById("hilfe-button");
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block:    'start'
      });
    }
    this.filterForStatus(this.offsetMultiplictor,this.queryPageLimit,this.currentTimestamp)
  }
  public nextPageButton(){
    this.offsetMultiplictor++;
    const element = document.getElementById("hilfe-button");
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    this.filterForStatus(this.offsetMultiplictor,this.queryPageLimit,this.currentTimestamp)
  }
  selectTimestamp() {
    this.currentTimestamp = FilterTimestampInputbarComponent.currentTimestamp
    console.log('Timestamp switched to ' + this.currentTimestamp + ' and resetted OffsetMultiplicator')
    this.queryPageLimit= 500;
    this.offsetMultiplictor=0;
    this.filterForStatus(this.offsetMultiplictor,this.queryPageLimit,this.currentTimestamp)
  }
  filterForStatus(multiplicator: number,pagelimit: number,timestamp:string) {
    try {
      switch(this.currentStatus) {
        case "Fehlgeschlagen":
          this.MigrationDataProvider.findErrors(multiplicator,pagelimit,timestamp)
              .then((response: BogenligaResponse<TriggerDTO[]>) => {
                this.handleLoadTableRowsSuccess(response);
                console.log(response);
              })
              .catch((response: BogenligaResponse<TriggerDTO[]>) => this.handleLoadTableRowsFailure(response));
          break;
        case "Alle":
          this.MigrationDataProvider.findAllWithPages(multiplicator,pagelimit,timestamp)
              .then((response: BogenligaResponse<TriggerDTO[]>) => {
                this.handleLoadTableRowsSuccess(response);
                console.log(response);
              })
              .catch((response: BogenligaResponse<TriggerDTO[]>) => this.handleLoadTableRowsFailure(response));
          break;
        case "Erfolgreich":
          this.MigrationDataProvider.findSuccessed(multiplicator,pagelimit,timestamp)
              .then((response: BogenligaResponse<TriggerDTO[]>) => {
                this.handleLoadTableRowsSuccess(response);
                console.log(response);
              })
              .catch((response: BogenligaResponse<TriggerDTO[]>) => this.handleLoadTableRowsFailure(response));
          break;
        case "Laufend":
          this.MigrationDataProvider.findInProgress(multiplicator,pagelimit,timestamp)
              .then((response: BogenligaResponse<TriggerDTO[]>) => {
                this.handleLoadTableRowsSuccess(response);
                console.log(response);
              })
              .catch((response: BogenligaResponse<TriggerDTO[]>) => this.handleLoadTableRowsFailure(response));
          break;
        case "Neu":
          this.MigrationDataProvider.findNews(multiplicator,pagelimit,timestamp)
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
    this.currentStatus = FilterinputbarComponent.currentStatus
    console.log('Status switched to ' + this.currentStatus + ' and resetted OffsetMultiplicator')
    this.queryPageLimit= 500;
    this.offsetMultiplictor=0;
    this.filterForStatus(this.offsetMultiplictor,this.queryPageLimit,this.currentTimestamp)
  }
  deleteEntries() {
    try {
      this.notificationService.showNotification({
        id:          'Löschung durchführen?',
        description: 'Möchten Sie die Eintrage löschen?',
        title:       'Löschung starten',
        origin:      NotificationOrigin.SYSTEM,
        type:        NotificationType.YES_NO,
        severity:    NotificationSeverity.QUESTION,
        userAction:  NotificationUserAction.PENDING
      });


      this.notificationService.observeNotification('Löschung durchführen?')
          .subscribe((myNotification) => {
            if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
              this.offsetMultiplictor = 0;
              this.queryPageLimit = 500;
              this.MigrationDataProvider.deleteEntries(this.currentStatus,this.currentTimestamp)
                  .then((response: BogenligaResponse<TriggerDTO[]>) => {
                    this.handleLoadTableRowsSuccess(response);
                    console.log(response);
                  })
                  .catch((response: BogenligaResponse<TriggerDTO[]>) => this.handleLoadTableRowsFailure(response));
            }
          });
    } catch (e) {
      this.notificationService.showNotification({
        id:          'Fehler beim Starten der Löschung',
        description: 'Ein Fehler ist aufgetreten und es wurden keine Daten gelöscht.',
        title:       'Fehler beim Start des Löschens',
        origin:      NotificationOrigin.SYSTEM,
        userAction:  NotificationUserAction.ACCEPTED,
        type:        NotificationType.OK,
        severity:    NotificationSeverity.INFO
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
  private handleEntireData(response: BogenligaResponse<TriggerCountDTO>): void {
    this.countObj = response.payload;
    this.entireCount = this.countObj.count;
    this.loading = false;
  }
  private handleSucceeededData(response: BogenligaResponse<TriggerCountDTO>): void {
    this.countObj = response.payload;
    this.succeededCount = this.countObj.count;
    this.loading = false;
  }

  private handleInProgressData(response: BogenligaResponse<TriggerCountDTO>): void {
    this.inprogressObj = response.payload;
    this.inProgressCount = this.inprogressObj.count;
    this.loading = false;
  }
}
