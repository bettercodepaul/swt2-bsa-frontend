import {Component, Input, OnInit} from '@angular/core';
import{Location} from '@angular/common';

import {CommonComponent} from '../../../shared/components/common';
import {TableRow} from '../../../shared/components/tables/types/table-row.class';
import {DsbMannschaftDataProviderService} from '../../../verwaltung/services/dsb-mannschaft-data-provider.service';
import {toTableRows} from '../../../shared/components/tables';
import {Response} from '../../../shared/data-provider';
import {DsbMannschaftDTO} from '../../../verwaltung/types/datatransfer/dsb-mannschaft-dto.class';
import {VereineDataProviderService} from '../../services/vereine-data-provider.service';
import {RegionDataProviderService} from '../../../verwaltung/services/region-data-provider.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '../../../shared/services/notification';
import {isUndefined} from 'util';
import {VereinDO} from '../../../verwaltung/types/verein-do.class';
import {VEREIN_MANNSCHAFTEN_CONFIG} from './vereine-mannschaften.config';
import {DsbMannschaftDO} from '../../../verwaltung/types/dsb-mannschaft-do.class';

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
  public mannschaften: DsbMannschaftDO[];

  constructor(private DsbMannschaftDataProvider: DsbMannschaftDataProviderService,
              private vereinProvider: VereineDataProviderService,
              private regionProvider: RegionDataProviderService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private _location: Location) {
    super();
  }

  ngOnInit() {
    this.loading = true;

    this.notificationService.discardNotification();

    this.route.params.subscribe(params => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        const id = params[ID_PATH_PARAM];
        this.loadVereinById(params[ID_PATH_PARAM]);
      }
    });

    this.loadMannschaften();
  }

  private test() {
    console.log('Test!');
  }

  private loadVereinById(id: number) {
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

  private loadMannschaften() {
      this.loading = true;

    this.DsbMannschaftDataProvider.findAll()
      .then((response: Response<DsbMannschaftDTO[]>) => this.handleLoadMannschaftenSuccess(response))
      .catch((response: Response<DsbMannschaftDTO[]>) => this.handleLoadMannschaftenFailure(response));
  }

  private handleLoadMannschaftenSuccess(response: Response<DsbMannschaftDTO[]>): void {
    this.mannschaften = []; // Reset Array

    this.mannschaften = response.payload;

    this.filterMannschaften();
    this.loading = false;
  }

  private handleLoadMannschaftenFailure(response: Response<DsbMannschaftDTO[]>): void {
    this.mannschaften = [];
    this.loading = false;
  }

  private filterMannschaften(): void {
    // TODO log
    // console.log(this.currentVerein);
    let filteredMannschaften = [];
    for (let mannschaft of this.mannschaften) {
      // TODO log
      // console.log(mannschaft.vereinId + ' ' + this.currentVerein.id);
      if (mannschaft.vereinId === this.currentVerein.id) {
        filteredMannschaften.push(mannschaft);
      }
    }
    this.mannschaften = filteredMannschaften;

    // TODO Log
    // console.log('Filtered Mannschaften:');
    // console.log(this.mannschaften);
  }

  private backClicked(): void {
    this.router.navigateByUrl('/vereine');
  }
}
