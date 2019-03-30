import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {CommonComponent} from '../../../../shared/components/common';
import {toTableRows} from '../../../../shared/components/tables';
import {TableRow} from '../../../../shared/components/tables/types/table-row.class';
import {BogenligaResponse} from '../../../../shared/data-provider';
import {VersionedDataObject} from '../../../../shared/data-provider/models/versioned-data-object.interface';
import {NotificationService} from '../../../../shared/services/notification';
import {WettkampfklassenDataProviderService} from '../../../services/wettkampfklassen-data-provider.service';
import {WettkampfKlasseDTO} from '../../../types/datatransfer/wettkampfklasse-dto.class';
import {WETTKAMPFKLASE_OVERVIEW_CONFIG} from './wettkampfklasse-overview.config';

@Component({
  selector: 'bla-wettkampfklasse-overview',
  templateUrl: './wettkampfklasse-overview.component.html',
  styleUrls: ['./wettkampfklasse-overview.component.scss']
})
export class WettkampfklasseOverviewComponent extends CommonComponent implements OnInit {

  public config = WETTKAMPFKLASE_OVERVIEW_CONFIG;
  public rows: TableRow[];

  constructor(private wettkampfklassenDataProvider: WettkampfklassenDataProviderService, private router: Router, private notificationService: NotificationService) {
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

    this.wettkampfklassenDataProvider.findAll()
        .then((response: BogenligaResponse<WettkampfKlasseDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: BogenligaResponse<WettkampfKlasseDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private handleLoadTableRowsFailure(response: BogenligaResponse<WettkampfKlasseDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<WettkampfKlasseDTO[]>): void {
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/klassen/' + versionedDataObject.id);
  }
}
