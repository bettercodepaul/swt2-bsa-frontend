import {Component, Input, OnInit} from '@angular/core';

import {CommonComponent} from '../../../shared/components/common';
import {DSB_MANNSCHAFT_OVERVIEW_CONFIG} from "../../../verwaltung/components/dsb-mannschaft/dsb-mannschaft-overview/dsb-mannschaft-overview.config";
import {TableRow} from "../../../shared/components/tables/types/table-row.class";
import {DsbMannschaftDataProviderService} from "../../../verwaltung/services/dsb-mannschaft-data-provider.service";
import {toTableRows} from "../../../shared/components/tables";
import {Response} from "../../../shared/data-provider";
import {DsbMannschaftDTO} from "../../../verwaltung/types/datatransfer/dsb-mannschaft-dto.class";


@Component({
  selector: 'bla-vereine-mannschaften',
  templateUrl: './vereine-mannschaften.component.html',
  styleUrls: ['./vereine-mannschaften.component.scss']
})
export class VereineMannschaftenComponent extends CommonComponent implements OnInit {

  @Input() vereinID: string = "0";

  public config = DSB_MANNSCHAFT_OVERVIEW_CONFIG;
  public rows: TableRow[];

  constructor(private DsbMannschaftDataProvider: DsbMannschaftDataProviderService) {
    super();
  }

  ngOnInit() {
    this.loadTableRows();
  }

  private loadTableRows() {
    this.loading = true;

    this.DsbMannschaftDataProvider.findAll()
      .then((response: Response<DsbMannschaftDTO[]>) => this.handleLoadTableRowsSuccess(response))
      .catch((response: Response<DsbMannschaftDTO[]>) => this.handleLoadTableRowsFailure(response));
  }

  private handleLoadTableRowsFailure(response: Response<DsbMannschaftDTO[]>): void {
    this.rows = [];
    this.loading = false;
  }

  private handleLoadTableRowsSuccess(response: Response<DsbMannschaftDTO[]>): void {
    this.rows = []; // reset array to ensure change detection
    //FILTER
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }
}
