import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonComponentDirective} from '../../../../shared/components/common';
import {toTableRows} from '../../../../shared/components/tables';
import {TableRow} from '../../../../shared/components/tables/types/table-row.class';
import {BogenligaResponse} from '../../../../shared/data-provider';
import {VersionedDataObject} from '../../../../shared/data-provider/models/versioned-data-object.interface';
import {NotificationService} from '../../../../shared/services/notification';
import {EINSTELLUNGEN_OVERVIEW_CONFIG} from './einstellungen-overview.config';
import {BenutzerRolleDO} from '@verwaltung/types/benutzer-rolle-do.class';
import {BenutzerDO} from '@verwaltung/types/benutzer-do.class';
import {DsbMitgliedDataProviderService} from '@verwaltung/services/dsb-mitglied-data-provider.service';
import {DsbMitgliedDTO} from '@verwaltung/types/datatransfer/dsb-mitglied-dto.class';
import {CurrentUserService, UserPermission} from '@shared/services';

@Component({
  selector: 'bla-einstellungen-overview',
  templateUrl: './einstellungen-overview.component.html',
  styleUrls: ['./einstellungen-overview.component.scss']
})
export class EinstellungenOverviewComponent extends CommonComponentDirective implements OnInit {

  public config = EINSTELLUNGEN_OVERVIEW_CONFIG;
  public rows: TableRow[];


  //private einstellungenDataProvider: EinstellungenDataProviderService
  constructor(private dsbMitgliedDataProvider: DsbMitgliedDataProviderService, private router: Router,private currentUserService: CurrentUserService) {
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
    // TODO
   }



  private loadTableRows() {
    this.loading = true;

    this.dsbMitgliedDataProvider.findAll()
       .then((response: BogenligaResponse<DsbMitgliedDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<DsbMitgliedDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<DsbMitgliedDTO[]>): void {
    if (this.currentUserService.hasPermission(UserPermission.CAN_MODIFY_VEREIN_DSBMITGLIEDER)) {
      response.payload = response.payload.filter((entry) => this.currentUserService.getVerein() === entry.vereinsId);
    }
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }

  private handleLoadTableRowsFailure(response: BogenligaResponse<DsbMitgliedDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }


  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/einstellungen/' + versionedDataObject.id);
  }
}
