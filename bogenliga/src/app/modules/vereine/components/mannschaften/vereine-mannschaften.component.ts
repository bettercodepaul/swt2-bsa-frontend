import {Component, Input, OnInit} from '@angular/core';

import {CommonComponent} from '../../../shared/components/common';
import {DSB_MANNSCHAFT_OVERVIEW_CONFIG} from '../../../verwaltung/components/dsb-mannschaft/dsb-mannschaft-overview/dsb-mannschaft-overview.config';
import {TableRow} from '../../../shared/components/tables/types/table-row.class';
import {DsbMannschaftDataProviderService} from '../../../verwaltung/services/dsb-mannschaft-data-provider.service';
import {toTableRows} from '../../../shared/components/tables';
import {Response} from '../../../shared/data-provider';
import {DsbMannschaftDTO} from '../../../verwaltung/types/datatransfer/dsb-mannschaft-dto.class';
import {VereinDataProviderService} from '../../../verwaltung/services/verein-data-provider.service';
import {RegionDataProviderService} from '../../../verwaltung/services/region-data-provider.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../shared/services/notification';
import {isUndefined} from 'util';
import {VereinDO} from '../../../verwaltung/types/verein-do.class';
import {VEREIN_MANNSCHAFTEN_CONFIG} from './vereine-mannschaften.config';

const ID_PATH_PARAM = 'id';

@Component({
  selector: 'bla-vereine-mannschaften',
  templateUrl: './vereine-mannschaften.component.html',
  styleUrls: ['./vereine-mannschaften.component.scss']
})
export class VereineMannschaftenComponent extends CommonComponent implements OnInit {

  public config = VEREIN_MANNSCHAFTEN_CONFIG;
  public currentVerein: VereinDO = new VereinDO();
  public rows: TableRow[];

  constructor(private DsbMannschaftDataProvider: DsbMannschaftDataProviderService,
              private vereinProvider: VereinDataProviderService,
              private regionProvider: RegionDataProviderService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.loading = true;

    this.notificationService.discardNotification();

    this.route.params.subscribe(params => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        const id = params[ID_PATH_PARAM];
        if (id === 'add') {
          this.currentVerein = new VereinDO();
          this.loading = false;
        } else {
          this.loadById(params[ID_PATH_PARAM]);
        }
      }
    });
    this.loadTableRows();
  }

  private loadById(id: number) {
    this.vereinProvider.findById(id)
      .then((response: Response<VereinDO>) => this.handleSuccess(response))
      .catch((response: Response<VereinDO>) => this.handleFailure(response));
  }

  private handleSuccess(response: Response<VereinDO>) {
    this.currentVerein = response.payload;
    this.loading = false;
  }

  private handleFailure(response: Response<VereinDO>) {
    this.loading = false;
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
    // FILTER
    this.rows = toTableRows(response.payload);
    this.loading = false;
  }
}
