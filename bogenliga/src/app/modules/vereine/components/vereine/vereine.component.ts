import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {CommonComponent} from '../../../shared/components/common';
import {toTableRows} from '../../../shared/components/tables';
import {TableRow} from '../../../shared/components/tables/types/table-row.class';
import {BogenligaResponse} from '../../../shared/data-provider';
import {NotificationService} from '../../../shared/services/notification';
import {VereineDataProviderService} from '../../services/vereine-data-provider.service';
import {VereineDTO} from '../../types/datatransfer/vereine-dto.class';
import {VereineDO} from '../../types/vereine-do.class';
import {VEREINE_CONFIG} from './vereine.config';

@Component({
  selector: 'bla-vereine',
  templateUrl: './vereine.component.html',
  styleUrls: ['./vereine.component.scss']
})
export class VereineComponent extends CommonComponent implements OnInit {

  public config = VEREINE_CONFIG;
  public rows: TableRow[];

  constructor(private vereineDataProvider: VereineDataProviderService, private router: Router, private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.loadTableRows();
  }

  public onView(vereineDO: VereineDO): void {
    this.navigateToDetailDialog(vereineDO);
  }

  public onRow(vereineDO: VereineDO): void {
    this.navigateToDetailDialog(vereineDO);
  }

  private navigateToDetailDialog(vereineDO: VereineDO) {
    this.router.navigateByUrl('/vereine/' + vereineDO.id);
  }

  private loadTableRows() {
    this.loading = true;

    this.vereineDataProvider.findAll()
      .then((response: BogenligaResponse<VereineDTO[]>) => this.handleLoadTableRowsSuccess(response))
      .catch((response: BogenligaResponse<VereineDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private handleLoadTableRowsSuccess(response: BogenligaResponse<VereineDO[]>): void {
    this.rows = []; // reset array to ensure change detection
    this.rows = toTableRows(response.payload);
    console.log(this.rows);
    this.loading = false;
  }

  private handleLoadTableRowsFailure(response: BogenligaResponse<VereineDO[]>): void {
    this.rows = [];
    this.loading = false;
  }

}
