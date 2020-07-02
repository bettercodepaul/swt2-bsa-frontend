
import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {CommonComponent} from '../../../../shared/components/common';
import {hideLoadingIndicator, showDeleteLoadingIndicatorIcon, toTableRows} from '../../../../shared/components/tables';
import {TableRow} from '../../../../shared/components/tables/types/table-row.class';
import {BogenligaResponse} from '../../../../shared/data-provider';
import {VersionedDataObject} from '../../../../shared/data-provider/models/versioned-data-object.interface';
import {isNullOrUndefined} from '@shared/functions';
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

import {SportjahrVeranstaltungDTO} from '@verwaltung/types/datatransfer/sportjahr-veranstaltung-dto';
import {SportjahrVeranstaltungDO} from '@verwaltung/types/sportjahr-veranstaltung-do';
import {PlaygroundVersionedDataObject} from '../../../../playground/components/playground/types/playground-versioned-data-object.class';
import {of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {CurrentUserService, UserPermission} from '@shared/services';

export const NOTIFICATION_DELETE_VERANSTALTUNG = 'veranstaltung_overview_delete';

@Component({
  selector:    'bla-veranstaltung-overview',
  templateUrl: './veranstaltung-overview.component.html',
  styleUrls:   ['./veranstaltung-overview.component.scss']
})
export class VeranstaltungOverviewComponent extends CommonComponent implements OnInit {

  public table_config = VERANSTALTUNG_OVERVIEW_TABLE_CONFIG;

  public rows: TableRow[];

  public loading = true;
  public loadingYear = true;
  public loadingSearch = true;
  public selecetedYear = this.getCurrentYear();
  public selectedDTOs: SportjahrVeranstaltungDO[];
  public multipleSelections = true;

  constructor(private veranstaltungDataProvider: VeranstaltungDataProviderService,
              private router: Router, private notificationService: NotificationService,
              private currentUserService: CurrentUserService) {
    super();
  }

  ngOnInit() {
   // this.loadTableRows();

    this.loadBySportjahr();
    this.loadDistinctSporjahr();

  }

  private getCurrentYear(): number {
    this.selecetedYear = new Date().getFullYear();
    return this.selecetedYear;
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
                .then((response) => this.loadBySportjahr())
                .catch((response) => this.rows = hideLoadingIndicator(this.rows, id));
          } else if (myNotification.userAction === NotificationUserAction.DECLINED) {
            this.rows = hideLoadingIndicator(this.rows, id);
          }
        });
    this.notificationService.showNotification(notification);
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<VeranstaltungDO[]>): void {
    if (this.currentUserService.hasPermission(UserPermission.CAN_MODIFY_MY_VERANSTALTUNG) &&
    !this.currentUserService.hasPermission(UserPermission.CAN_MODIFY_STAMMDATEN)) {
      response.payload = response.payload.filter((entry) => this.currentUserService.hasVeranstaltung(entry.id));
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

  private loadBySportjahr(): void {
    this.loadingSearch = true;
    console.log(this.selecetedYear);
    this.veranstaltungDataProvider.findBySportyear(this.selecetedYear)
        .then((newList: BogenligaResponse<VeranstaltungDO[]>) => this.handleLoadTableRowsSuccess(newList))
        .catch((newList: BogenligaResponse<VeranstaltungDTO[]>) => this.handleLoadBySportjahrfailure(newList));

  }

  private handleLoadBySportjahrfailure(response: BogenligaResponse<VeranstaltungDTO[]>): void {
    this.rows = [];
    this.loadingSearch = false;
  }

  // Diese Methode lädt alle Sportjahr von Veranstaltungen Distinct

  private loadDistinctSporjahr(): void {
    this.loadingYear = true;
    this.veranstaltungDataProvider.findAllSportyearDestinct()
        .then((newList: BogenligaResponse<SportjahrVeranstaltungDO[]>) => this.handleLoadDistinctSportjahrSecess(newList))
        .catch((newList: BogenligaResponse<SportjahrVeranstaltungDTO[]>) => this.handleLoadDistinctSportjahrFailure(newList));
  }


  private handleLoadDistinctSportjahrSecess(response: BogenligaResponse<SportjahrVeranstaltungDO[]>): void {
    this.selectedDTOs = [];
    this.selectedDTOs = response.payload;
    this.loadingYear = false;
    console.log(this.selectedDTOs);

  }

  private handleLoadDistinctSportjahrFailure(response: BogenligaResponse<SportjahrVeranstaltungDTO[]>): void {
    this.selectedDTOs = [];
    this.loadingYear = false;
  }

  public onSelect($event: SportjahrVeranstaltungDO[]): void {
    this.selecetedYear = null;
    this.selecetedYear = $event[0].sportjahr;
    this.loadBySportjahr();
  }

}
