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
import {VereinDataProviderService} from '../../../services/verein-data-provider.service';
import {VereinDTO} from '../../../types/datatransfer/verein-dto.class';
import {VEREIN_OVERVIEW_CONFIG} from './verein-overview.config';
import {SessionHandling} from '@shared/event-handling';
import {CurrentUserService, OnOfflineService} from '@shared/services';
import {UserRolleDO} from '@verwaltung/types/user-rolle-do.class';
import {UserDataProviderService} from '@verwaltung/services/user-data-provider.service';
import {VereinDO} from '@verwaltung/types/verein-do.class';
import {RegionDO} from '@verwaltung/types/region-do.class';
import {RegionDataProviderService} from '@verwaltung/services/region-data-provider.service';
import * as VereinDetailComponent from '@verwaltung/components/verein/verein-detail/verein-detail.component';
import {LigaDataProviderService} from '@verwaltung/services/liga-data-provider.service';

export const NOTIFICATION_DELETE_VEREINE = 'vereine_overview_delete';
const PLATZHALTER_ID = 99;

@Component({
  selector:    'bla-verein-overview',
  templateUrl: './verein-overview.component.html',
  styleUrls:   ['./verein-overview.component.scss']
})
export class VereinOverviewComponent extends CommonComponentDirective implements OnInit {

  public config = VEREIN_OVERVIEW_CONFIG;
  public rows: TableRow[];
  public searchTerm = 'searchTermVereine';

  private sessionHandling: SessionHandling;

  constructor(private vereinDataProvider: VereinDataProviderService,
    private router: Router,
    private notificationService: NotificationService,
    private currentUserService: CurrentUserService,
    private onOfflineService: OnOfflineService,
    private userDataProviderService: UserDataProviderService,
    private vereinProvider: VereinDataProviderService,
    private regionProvider: RegionDataProviderService,
    private ligaProvider: LigaDataProviderService,)
  {
    super();
    this.sessionHandling = new SessionHandling(this.currentUserService, this.onOfflineService);
  }

  ngOnInit() {
    this.loading = true;
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

    if(id == PLATZHALTER_ID) {
      const notification: Notification = {
        id:               NOTIFICATION_DELETE_VEREINE + id,
        title:            'MANAGEMENT.VEREINE.NOTIFICATION_PLATZHALTER.DELETE.TITLE',
        description:      'MANAGEMENT.VEREINE.NOTIFICATION_PLATZHALTER.DELETE.DESCRIPTION',
        descriptionParam: '' + id,
        severity:         NotificationSeverity.INFO,
        origin:           NotificationOrigin.USER,
        type:             NotificationType.OK,
        userAction:       NotificationUserAction.PENDING
      };
      this.notificationService.observeNotification(NOTIFICATION_DELETE_VEREINE + id)
          .subscribe((myNotification) => {
            if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
              this.rows = hideLoadingIndicator(this.rows, id);
            }
          });
      this.notificationService.showNotification(notification);

    }
    else {
      const notification: Notification = {
        id:               NOTIFICATION_DELETE_VEREINE + id,
        title:            'MANAGEMENT.VEREINE.NOTIFICATION.DELETE.TITLE',
        description:      'MANAGEMENT.VEREINE.NOTIFICATION.DELETE.DESCRIPTION',
        descriptionParam: '' + id,
        severity:         NotificationSeverity.QUESTION,
        origin:           NotificationOrigin.USER,
        type:             NotificationType.YES_NO,
        userAction:       NotificationUserAction.PENDING
      };

      this.notificationService.observeNotification(NOTIFICATION_DELETE_VEREINE + id)
          .subscribe((myNotification) => {
            if (myNotification.userAction === NotificationUserAction.ACCEPTED) {
              this.vereinDataProvider.deleteById(id)
                  .then((response) => this.loadTableRows())
                  .catch((response) => this.rows = hideLoadingIndicator(this.rows, id));
            } else if (myNotification.userAction === NotificationUserAction.DECLINED) {
              this.rows = hideLoadingIndicator(this.rows, id);
            }
          });

      this.notificationService.showNotification(notification);
    }
  }

  private async loadTableRows() {
    let currentUserId = this.currentUserService.getCurrentUserID();
    await this.userDataProviderService.findUserRoleById(currentUserId).then(async (roleresponse: BogenligaResponse<UserRolleDO[]>) => {
      let isLigaleiter = false;
      if (roleresponse.payload.filter(role => role.roleName == 'LIGALEITER').length > 0)
        isLigaleiter = true;

      if (isLigaleiter == true) {
        let ligaRegions: any[] = [];
        await this.ligaProvider.findAll().then(async (data) => {
          data.payload.forEach(e => {
            if (e.ligaVerantwortlichId === currentUserId) {
              ligaRegions.push(e.regionId);
            }
          })
          let allowedRegions: any[] = [];
          let seenRegions: any[] = [];

          // Erzeuge ein Array von Promises für alle rekursiven Aufrufe
          const recursivePromises = ligaRegions.map(e =>
            this.findAllowedRegionsForVereine(e, allowedRegions, seenRegions)
          );
          // Warte auf den Abschluss aller rekursiven Aufrufe
          await Promise.all(recursivePromises);
          //Erlaubte Vereine in die Liste schreiben
          await this.vereinProvider.findAll().then((value) => {
            let filteredVereine = value.payload.filter((f) => {
              return allowedRegions.includes(f.regionId);
            })
            this.handleLoadTableRowsSuccessVereine(filteredVereine);
          }).catch(e => console.log(e));
        }).catch(err => console.log(err));
      } else {
        await this.vereinDataProvider.findAll()
                  .then((response: BogenligaResponse<VereinDTO[]>) => this.handleLoadTableRowsSuccess(response))
                  .catch((response: BogenligaResponse<VereinDTO[]>) => this.handleLoadTableRowsFailure(response));
      }
    }).catch(err => console.log(err))
              .finally(() => this.loading = false);
  }

  public async findAllowedRegionsForVereine(parentRegionId, allowedRegions, seenRegions): Promise<any> {
    if (!(allowedRegions.includes(parentRegionId))) {
      allowedRegions.push(parentRegionId);  // Füge die übergeordnete Region zur erlaubten Regionenliste hinzu
    }
    const region = await this.regionProvider.findAll();
    const subRegions = region.payload.filter(e => e.regionUebergeordnet === parentRegionId && !seenRegions.includes(e.id));
    const recursivePromises = subRegions.map(e =>
      this.findAllowedRegionsForVereine(e.id, allowedRegions, seenRegions)
    );

    await Promise.all(recursivePromises);
    return allowedRegions;
  }

  public findBySearch($event: string) {
    this.vereinDataProvider.findBySearch($event)
        .then((response: BogenligaResponse<VereinDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<VereinDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/vereine/' + versionedDataObject.id);
  }

  private handleLoadTableRowsFailure(response: BogenligaResponse<VereinDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<VereinDTO[]>): void {
    this.handleLoadTableRowsSuccessVereine(response.payload);
  }

  private handleLoadTableRowsSuccessVereine(response: VereinDTO[]): void {
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response);
    this.loading = false;
  }

}
