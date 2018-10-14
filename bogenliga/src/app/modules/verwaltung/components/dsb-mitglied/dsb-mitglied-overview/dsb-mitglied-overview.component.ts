import {Component, OnInit} from '@angular/core';
import {DSB_MITGLIED_OVERVIEW_CONFIG} from './dsb-mitglied-overview.config';
import {DsbMitgliedDataProviderService} from '../../../services/dsb-mitglied-data-provider.service';
import {TableRow} from '../../../../shared/components/tables/types/table-row.class';
import {CommonComponent} from '../../../../shared/components/common';
import {Response} from '../../../../shared/data-provider';
import {DsbMitgliedDTO} from '../../../types/datatransfer/dsb-mitglied-dto.class';
import {VersionedDataObject} from '../../../../shared/data-provider/models/versioned-data-object.interface';
import {Router} from '@angular/router';

@Component({
  selector:    'bla-dsb-mitglied-overview',
  templateUrl: './dsb-mitglied-overview.component.html',
  styleUrls:   ['./dsb-mitglied-overview.component.scss']
})
export class DsbMitgliedOverviewComponent extends CommonComponent implements OnInit {

  public config = DSB_MITGLIED_OVERVIEW_CONFIG;
  public rows: TableRow[];

  constructor(private dsbMitgliedDataProvider: DsbMitgliedDataProviderService, private router: Router) {
    super();
  }

  ngOnInit() {
    this.loading = true;

    this.dsbMitgliedDataProvider.findAll2()
        .then((response: Response<DsbMitgliedDTO[]>) => this.handleSuccess(response))
        .catch((response: Response<DsbMitgliedDTO[]>) => this.handleFailure(response));
  }


  public onView(versionedDataObject: VersionedDataObject): void {
    this.navigateToDetailDialog(versionedDataObject);

  }

  public onEdit(versionedDataObject: VersionedDataObject): void {
    this.navigateToDetailDialog(versionedDataObject);
  }

  public onDelete(versionedDataObject: VersionedDataObject): void {

  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/dsbmitglieder/' + versionedDataObject.id);
  }

  private handleFailure(response: Response<DsbMitgliedDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleSuccess(response: Response<DsbMitgliedDTO[]>): void {
    const rows: TableRow[] = [];

    response.payload.forEach(mitglied => rows.push(new TableRow({payload: mitglied})));


    this.rows = rows;

    this.loading = false;
  }
}
