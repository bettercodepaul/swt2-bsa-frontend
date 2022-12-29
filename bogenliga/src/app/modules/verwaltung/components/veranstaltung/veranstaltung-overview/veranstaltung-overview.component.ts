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
import {VeranstaltungDataProviderService} from '../../../services/veranstaltung-data-provider.service';
import {VeranstaltungDTO} from '../../../types/datatransfer/veranstaltung-dto.class';
import {VeranstaltungDO} from '../../../types/veranstaltung-do.class';
import {VERANSTALTUNG_OVERVIEW_TABLE_CONFIG} from './veranstaltung-overview.config';
import {NOTIFICATION_DELETE_LIGA} from '@verwaltung/components/liga/liga-overview/liga-overview.component';
import {SportjahrVeranstaltungDTO} from '@verwaltung/types/datatransfer/sportjahr-veranstaltung-dto';
import {SportjahrVeranstaltungDO} from '@verwaltung/types/sportjahr-veranstaltung-do';
import {CurrentUserService, OnOfflineService, UserPermission} from '@shared/services';
import {SessionHandling} from '@shared/event-handling';
import {getActiveSportYear} from '@shared/functions/active-sportyear';
import {EinstellungenProviderService} from '@verwaltung/services/einstellungen-data-provider.service';

export const NOTIFICATION_DELETE_VERANSTALTUNG = 'veranstaltung_overview_delete';

@Component({
  selector:    'bla-veranstaltung-overview',
  templateUrl: './veranstaltung-overview.component.html',
  styleUrls:   ['./veranstaltung-overview.component.scss']
})
export class VeranstaltungOverviewComponent extends CommonComponentDirective implements OnInit {

  public table_config = VERANSTALTUNG_OVERVIEW_TABLE_CONFIG;

  public rows: TableRow[];

  public loading = true;
  public loadingYear = true;
  public loadingSearch = true;
  public selectedYear = this.getCurrentYear();
  public selectedDTOs: SportjahrVeranstaltungDO[];
  public multipleSelections = true;
  private aktivesSportjahr: number;
  private sessionHandling: SessionHandling;

  constructor(private veranstaltungDataProvider: VeranstaltungDataProviderService,
    private router: Router, private notificationService: NotificationService,
    private currentUserService: CurrentUserService,
    private einstellungenDataProvider: EinstellungenProviderService,
    private onOfflineService: OnOfflineService) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);
  }

  ngOnInit() {

    //aktives Sportjahr wird nur im Online Modus ausgelesen und setzt die Default Filterung
    //auf das aktive Sportjahr
    if(!this.onOfflineService.isOffline()) {
      getActiveSportYear(this.einstellungenDataProvider)
        .then(value => {
          this.aktivesSportjahr = value;
          this.loadDistinctSporjahr();
          this.loadBySportjahr(this.aktivesSportjahr);

        });
    } else {
      this.loadDistinctSporjahr();
      this.loadBySportjahr(this.selectedYear);

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

  private getCurrentYear(): number {
    this.selectedYear = new Date().getFullYear();
    return this.selectedYear;
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
                .then((response) => this.loadBySportjahr(this.selectedYear))
                .catch((response) => this.rows = hideLoadingIndicator(this.rows, id));
          } else if (myNotification.userAction === NotificationUserAction.DECLINED) {
            this.rows = hideLoadingIndicator(this.rows, id);
          }
        });
    this.notificationService.showNotification(notification);
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<VeranstaltungDO[]>): void {
    // Überprüft ob der User ein Ligaleiter ist, ist dass der Fall filtered er die Payload so das nur noch seine Veranstaltungen zu sehen sind
    if (this.currentUserService.hasPermission(UserPermission.CAN_MODIFY_MY_VERANSTALTUNG) &&
    !this.currentUserService.hasPermission(UserPermission.CAN_MODIFY_STAMMDATEN)) {
      response.payload = response.payload.filter((entry) => this.currentUserService.getCurrentUserID() === entry.ligaleiterId);
      console.log('detected');
    }
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/veranstaltung/' + versionedDataObject.id);
  }

// Diese Methode lädt Veranstaltungen aus dem Backend anhand ihres Sportjahres
// Listet sie anschlie0end in der Übersicht Reiehnweise auf
  private loadBySportjahr(choosenyear: number): void {
    this.loadingSearch = true;
    this.veranstaltungDataProvider.findBySportyearGeplantLaufend(choosenyear)
        .then((newList: BogenligaResponse<VeranstaltungDO[]>) => this.handleLoadTableRowsSuccess(newList))
        .catch((newList: BogenligaResponse<VeranstaltungDTO[]>) => this.handleLoadBySportjahrfailure(newList));

  }

  private handleLoadBySportjahrfailure(response: BogenligaResponse<VeranstaltungDTO[]>): void {
    this.rows = [];
    this.loadingSearch = false;
  }

  // Holt sich alle Sportjahre aus dem Backend und lädt sie anschließend in das Auswahlfenster

  private loadDistinctSporjahr(): void {
    this.loadingYear = true;
    this.veranstaltungDataProvider.findAllSportyearDestinct()
        .then((newList: BogenligaResponse<SportjahrVeranstaltungDO[]>) => this.handleLoadDistinctSportjahrSuccess(newList))
        .catch((newList: BogenligaResponse<SportjahrVeranstaltungDTO[]>) => this.handleLoadDistinctSportjahrFailure(newList));
  }


  private handleLoadDistinctSportjahrSuccess(response: BogenligaResponse<SportjahrVeranstaltungDO[]>): void {
    this.selectedDTOs = [];
    this.selectedDTOs = response.payload;
    this.loadingYear = false;


  }

  private handleLoadDistinctSportjahrFailure(response: BogenligaResponse<SportjahrVeranstaltungDTO[]>): void {
    this.selectedDTOs = [];
    this.loadingYear = false;
  }

  //Mehtode wird leider nie verwendet. Der onSelect kommt von der overview-selection-dialog-component.
  public onSelect($event: SportjahrVeranstaltungDO[]): void {
    this.selectedYear = $event[0].sportjahr;
    this.loadBySportjahr(this.selectedYear);
  }


}
