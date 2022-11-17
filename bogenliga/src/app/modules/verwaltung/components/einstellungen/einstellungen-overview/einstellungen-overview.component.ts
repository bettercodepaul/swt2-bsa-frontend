import {EinstellungenProviderService} from '@verwaltung/services/einstellungen-data-provider.service';

import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonComponentDirective} from '../../../../shared/components/common';
import {hideLoadingIndicator, showDeleteLoadingIndicatorIcon, toTableRows} from '../../../../shared/components/tables';
import {TableRow} from '../../../../shared/components/tables/types/table-row.class';
import {BogenligaResponse} from '../../../../shared/data-provider';
import {VersionedDataObject} from '../../../../shared/data-provider/models/versioned-data-object.interface';
import {Notification, NotificationService, NotificationType,} from '../../../../shared/services/notification';
import {
  EINSTELLUNGEN_OVERVIEW_CONFIG
} from '@verwaltung/components/einstellungen/einstellungen-overview/einstellungen-overview.config';
import {CurrentUserService} from '@shared/services';
import {EinstellungenDTO} from '@verwaltung/types/datatransfer/einstellungen-dto.class';
import {EinstellungenDO} from '@verwaltung/types/einstellungen-do.class';
import {SessionHandling} from '@shared/event-handling';


const NOTIFICATION_DELETE_EINSTELLUNG = 'einstellung_detail_delete';

@Component({
  selector: 'bla-einstellungen-overview',
  templateUrl: './einstellungen-overview.component.html',
  styleUrls: ['./einstellungen-overview.component.scss']
})
export class EinstellungenOverviewComponent extends CommonComponentDirective implements OnInit {

  public config = EINSTELLUNGEN_OVERVIEW_CONFIG;
  public rows: TableRow[];
  public currentEinstellung: EinstellungenDO = new EinstellungenDO();
  public neucurrentEinstellung: EinstellungenDO = new EinstellungenDO();

  public saveLoading = false;
  visible_: boolean;

  private sessionHandling: SessionHandling;

  constructor(private einstellungenDataProvider: EinstellungenProviderService,
    private router: Router,
    private currentUserService: CurrentUserService,
    private notificationService: NotificationService) {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService);
  }

  ngOnInit() {
    this.loadTableRows();
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


  public onView(versionedDataObject: VersionedDataObject): void {
    this.navigateToDetailDialog(versionedDataObject);
  }

  public onEdit(versionedDataObject: VersionedDataObject): void {


    this.visible_ = true;



    this.navigateToDetailDialog(versionedDataObject);


  }


  public onDelete(versionedDataObject: VersionedDataObject): void {

    const id = versionedDataObject.id;

    const notification: Notification = {
      origin:      undefined, severity: undefined,
      id:          NOTIFICATION_DELETE_EINSTELLUNG,
      title:       'MANAGEMENT.EINSTELLUNG_DETAIL.NOTIFICATION.DELETE.TITLE',
      description: 'MANAGEMENT.EINSTELLUNG_DETAIL.NOTIFICATION.DELETE.DESCRIPTION',

      type:        NotificationType.OK

    };

    this.notificationService.showNotification(notification);


    this.rows = showDeleteLoadingIndicatorIcon(this.rows, id);
    this.einstellungenDataProvider.deleteById(id)
        .then((response) => this.loadTableRows())
        .catch((response) => this.rows = hideLoadingIndicator(this.rows, id));


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
