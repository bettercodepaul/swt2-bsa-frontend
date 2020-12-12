import {EinstellungenProviderService} from '@verwaltung/services/einstellungen-data-provider.service';

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
  NotificationSeverity, NotificationType, NotificationUserAction
} from '../../../../shared/services/notification';
import {EINSTELLUNGEN_OVERVIEW_CONFIG} from '@verwaltung/components/einstellungen/einstellungen-overview/einstellungen-overview.config';
import {BenutzerRolleDO} from '@verwaltung/types/benutzer-rolle-do.class';
import {BenutzerDO} from '@verwaltung/types/benutzer-do.class';
import {DsbMitgliedDataProviderService} from '@verwaltung/services/dsb-mitglied-data-provider.service';
import {DsbMitgliedDTO} from '@verwaltung/types/datatransfer/dsb-mitglied-dto.class';
import {CurrentUserService, UserPermission} from '@shared/services';
import {EinstellungenDTO} from '@verwaltung/types/datatransfer/einstellungen-dto.class';
import {EinstellungenDO} from '@verwaltung/types/einstellungen-do.class';
import {NOTIFICATION_DELETE_DSB_MITGLIED} from '@verwaltung/components';



@Component({
  selector: 'bla-einstellungen-overview',
  templateUrl: './einstellungen-overview.component.html',
  styleUrls: ['./einstellungen-overview.component.scss']
})
export class EinstellungenOverviewComponent extends CommonComponentDirective implements OnInit {

  public config = EINSTELLUNGEN_OVERVIEW_CONFIG;
  public rows: TableRow[];
  public currentEinstellung: EinstellungenDO= new EinstellungenDO();
  public neucurrentEinstellung: EinstellungenDO= new EinstellungenDO();

  public saveLoading = false

  //private einstellungenDataProvider: EinstellungenDataProviderService

  constructor(private einstellungenDataProvider: EinstellungenProviderService, private router: Router,private currentUserService: CurrentUserService,private notificationService: NotificationService,) {
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

    this.rows = showDeleteLoadingIndicatorIcon(this.rows, id);

    const notification: Notification = {
      id: NOTIFICATION_DELETE_DSB_MITGLIED + id,
      title: 'MANAGEMENT.DSBMITGLIEDER.NOTIFICATION.DELETE.TITLE',
      description: 'MANAGEMENT.DSBMITGLIEDER.NOTIFICATION.DELETE.DESCRIPTION',
      descriptionParam: '' + id,
      severity: NotificationSeverity.QUESTION,
      origin: NotificationOrigin.USER,
      type: NotificationType.YES_NO,
      userAction: NotificationUserAction.ACCEPTED

      
    };

    this.notificationService.observeNotification(NOTIFICATION_DELETE_DSB_MITGLIED + id)
        .subscribe((myNotification) => {
          if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
            this.einstellungenDataProvider.deleteById(id)
                .then((response) => this.loadTableRows())
                .catch((response) => this.rows = hideLoadingIndicator(this.rows, id));
          } else if (myNotification.userAction === NotificationUserAction.DECLINED) {
            this.rows = hideLoadingIndicator(this.rows, id);
          }
        });

    this.notificationService.showNotification(notification);

  }


  private loadTableRows() {
    this.loading = true;

    this.einstellungenDataProvider.findAll()
        .then((response: BogenligaResponse<EinstellungenDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<EinstellungenDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<EinstellungenDTO[]>): void {




    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    console.log(this.rows[1]);
    this.loading = false;


  }

  private handleLoadTableRowsFailure(response: BogenligaResponse<EinstellungenDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }


  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/einstellungen/' + versionedDataObject.id);
  }



}
