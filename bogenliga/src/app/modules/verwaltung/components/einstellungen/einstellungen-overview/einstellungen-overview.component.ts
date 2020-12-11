import {EinstellungenProviderService} from '@verwaltung/services/einstellungen-data-provider.service';

import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonComponentDirective} from '../../../../shared/components/common';
import {toTableRows} from '../../../../shared/components/tables';
import {TableRow} from '../../../../shared/components/tables/types/table-row.class';
import {BogenligaResponse} from '../../../../shared/data-provider';
import {VersionedDataObject} from '../../../../shared/data-provider/models/versioned-data-object.interface';
import {NotificationService} from '../../../../shared/services/notification';
import {EINSTELLUNGEN_OVERVIEW_CONFIG} from '@verwaltung/components/einstellungen/einstellungen-overview/einstellungen-overview.config';
import {BenutzerRolleDO} from '@verwaltung/types/benutzer-rolle-do.class';
import {BenutzerDO} from '@verwaltung/types/benutzer-do.class';
import {DsbMitgliedDataProviderService} from '@verwaltung/services/dsb-mitglied-data-provider.service';
import {DsbMitgliedDTO} from '@verwaltung/types/datatransfer/dsb-mitglied-dto.class';
import {CurrentUserService, UserPermission} from '@shared/services';
import {EinstellungenDTO} from '@verwaltung/types/datatransfer/einstellungen-dto.class';
import {EinstellungenDO} from '@verwaltung/types/einstellungen-do.class';

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
  constructor(private einstellungenDataProvider: EinstellungenProviderService, private router: Router,private currentUserService: CurrentUserService) {
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


  public onDelete(versionedDataObject: VersionedDataObject): void {
    // TODO
  }


  entityExists() {
    return false;
  }
}
