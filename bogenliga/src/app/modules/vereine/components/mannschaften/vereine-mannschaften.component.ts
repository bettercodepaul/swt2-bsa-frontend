import {Component, OnInit} from '@angular/core';

import {CommonComponent} from '../../../shared/components/common';
import {TableRow} from '../../../shared/components/tables/types/table-row.class';
import {DsbMannschaftDataProviderService} from '../../../verwaltung/services/dsb-mannschaft-data-provider.service';
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
const MANNSCHAFT_PATH_PARAM = 'mannschaft';


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
  public currentMannschaft: DsbMannschaftDO;

  constructor(private DsbMannschaftDataProvider: DsbMannschaftDataProviderService,
              private vereinProvider: VereineDataProviderService,
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
        this.loadVereinById(params[ID_PATH_PARAM]);
      }
    });
  }

  private loadVereinById(id: number) {
    this.vereinProvider.findById(id)
      .then((response: Response<VereinDO>) => this.handleSuccess(response))
      .catch((response: Response<VereinDO>) => this.handleFailure(response));
  }

  private handleSuccess(response: Response<VereinDO>) {
    this.currentVerein = response.payload;
    this.loadMannschaften();
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
    this.setCurrentMansnchaft();
    this.loading = false;
  }

  private handleLoadMannschaftenFailure(response: Response<DsbMannschaftDTO[]>): void {
    this.mannschaften = [];
    this.loading = false;
  }

  private setCurrentMansnchaft() {

    this.route.params.subscribe(params => {
      if (!isUndefined(params[MANNSCHAFT_PATH_PARAM])) {
        console.log(params[MANNSCHAFT_PATH_PARAM]);
        console.log(this.mannschaften);
        for (let mannschaft of this.mannschaften) {
          if (mannschaft.id  === parseInt(params[MANNSCHAFT_PATH_PARAM], 10)) {
            console.log('CurrentMannschaft');
            console.log(this.currentMannschaft);
            this.currentMannschaft = mannschaft;
          }
        }
      }
    });

  }

  private filterMannschaften(): void {
    let filteredMannschaften = [];
    for (let mannschaft of this.mannschaften) {
      if (mannschaft.vereinId === this.currentVerein.id) {
        filteredMannschaften.push(mannschaft);
      }
    }
    this.mannschaften = filteredMannschaften;
  }

  private backClicked(): void {
    this.router.navigateByUrl('/vereine');
  }

  private navigateToMannschaft(mannschaft: DsbMannschaftDO) {
    this.router.navigateByUrl('/vereine/' + this.currentVerein.id + '/' + mannschaft.id);
  }
}
