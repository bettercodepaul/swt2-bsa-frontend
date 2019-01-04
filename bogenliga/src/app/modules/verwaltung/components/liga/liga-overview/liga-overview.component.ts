import { Component, OnInit } from '@angular/core';
import {TableRow} from '../../../../shared/components/tables/types/table-row.class';
import {LIGA_OVERVIEW_CONFIG} from './liga-overview.config';
import {LigaDataProviderService} from '../../../services/liga-data-provider.service';
import {Router} from '@angular/router';
import {NotificationService} from '../../../../shared/services/notification';
import {Response} from '../../../../shared/data-provider';
import {VersionedDataObject} from '../../../../shared/data-provider/models/versioned-data-object.interface';
import {toTableRows} from '../../../../shared/components/tables';
import {LigaDTO} from '../../../types/datatransfer/liga-dto.class';
import {CommonComponent} from '../../../../shared/components/common';

@Component({
  selector: 'bla-liga-overview',
  templateUrl: './liga-overview.component.html',
  styleUrls: ['./liga-overview.component.scss']
})
export class LigaOverviewComponent extends CommonComponent implements OnInit {

  public config = LIGA_OVERVIEW_CONFIG;
  public rows: TableRow[];

  constructor(private ligaDataProvider: LigaDataProviderService, private router: Router, private notificationService: NotificationService) {
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

    this.ligaDataProvider.findAll()
        .then((response: Response<LigaDTO[]>) => this.handleLoadTableRowsSuccess(response))
        .catch((response: Response<LigaDTO[]>) => this.handleLoadTableRowsFailure(response))
  }

  private handleLoadTableRowsFailure(response: Response<LigaDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: Response<LigaDTO[]>): void {
    this.rows = []; // reset array to ensure change detection
   /** this.rows = toTableRows(response.payload);**/
    this.loading = false;
  }

  private navigateToDetailDialog(versionedDataObject: VersionedDataObject) {
    this.router.navigateByUrl('/verwaltung/liga/' + versionedDataObject.id);
  }


}
