import {Component, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {isUndefined} from '@shared/functions';
import {CommonComponent} from '../../../shared/components/common';
import {toTableRows} from '../../../shared/components/tables';
import {TableRow} from '../../../shared/components/tables/types/table-row.class';
import {Response} from '../../../shared/data-provider';
import {NotificationService} from '../../../shared/services/notification';
import {DsbMannschaftDataProviderService} from '../../../verwaltung/services/dsb-mannschaft-data-provider.service';
import {RegionDataProviderService} from '../../../verwaltung/services/region-data-provider.service';
import {DsbMannschaftDTO} from '../../../verwaltung/types/datatransfer/dsb-mannschaft-dto.class';
import {DsbMannschaftDO} from '../../../verwaltung/types/dsb-mannschaft-do.class';
import {VereinDO} from '../../../verwaltung/types/verein-do.class';
import {MannschaftsmitgliederDataProviderService} from '../../services/mannschaftsmitglieder-data-provider.service';
import {VereineDataProviderService} from '../../services/vereine-data-provider.service';
import {MannschaftsMitgliedDTO} from '../../types/datatransfer/mannschaftsmitglied-dto.class';
import {MannschaftsmitgliedDO} from '../../types/mannschaftsmitglied-do.class';
import {VEREIN_MANNSCHAFTEN_CONFIG} from './vereine-mannschaften.config';

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
  public mannschaftsMitdliedRows: TableRow[];
  public mannschaften: DsbMannschaftDO[];
  public currentMannschaft: DsbMannschaftDO;
  public mannschaftsMitglieder: MannschaftsmitgliedDO[];

  constructor(private DsbMannschaftDataProvider: DsbMannschaftDataProviderService,
              private MannschaftsmitgliederDataProvider: MannschaftsmitgliederDataProviderService,
              private VereinProvider: VereineDataProviderService,
              private regionProvider: RegionDataProviderService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService) {
    super();
  }

  ngOnInit() {
    this.loading = true;

    this.notificationService.discardNotification();

    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        this.loadVereinById(params[ID_PATH_PARAM]);
      }
    });
  }

  private loadVereinById(id: number) {
    this.VereinProvider.findById(id)
      .then((response: Response<VereinDO>) => this.handleVereinSuccess(response))
      .catch((response: Response<VereinDO>) => this.handleVereinFailure(response));
  }

  private handleVereinSuccess(response: Response<VereinDO>) {
    this.currentVerein = response.payload;
    this.loadMannschaften();
    this.loading = false;
  }

  private handleVereinFailure(response: Response<VereinDO>) {
    this.loading = false;
  }

  private loadMannschaften() {
      this.loading = true;

      this.DsbMannschaftDataProvider.findAll()
      .then((response: Response<DsbMannschaftDTO[]>) => this.handleMannschaftenSuccess(response))
      .catch((response: Response<DsbMannschaftDTO[]>) => this.handleMannschaftenFailure(response));
  }

  private handleMannschaftenSuccess(response: Response<DsbMannschaftDTO[]>): void {
    this.mannschaften = []; // Reset Array

    this.mannschaften = response.payload;

    this.filterMannschaften();
    this.setCurrentMannschaft();
    this.loading = false;
  }

  private handleMannschaftenFailure(response: Response<DsbMannschaftDTO[]>): void {
    this.mannschaften = [];
    console.log('Error, could not load Mannschaften: ' + response);
    this.loading = false;
  }

  private setCurrentMannschaft() {

    this.route.params.subscribe((params) => {
      if (!isUndefined(params[MANNSCHAFT_PATH_PARAM])) {
        for (const mannschaft of this.mannschaften) {
          if (mannschaft.id  === parseInt(params[MANNSCHAFT_PATH_PARAM], 10)) {
            this.currentMannschaft = mannschaft;
            this.loadMannschaftsMitglieder();
          }
        }
      }
    });
  }

  private loadMannschaftsMitglieder() {
    this.loading = true;

    this.MannschaftsmitgliederDataProvider.findByMannschaftId(this.currentMannschaft.id)
      .then((response: Response<MannschaftsMitgliedDTO[]>) => this.handleMannschftsmitgliedSuccess(response))
      .catch((response: Response<MannschaftsMitgliedDTO[]>) => this.handleMannschaftsmitgliedFailure(response));
  }

  private handleMannschftsmitgliedSuccess(response: Response<MannschaftsMitgliedDTO[]>): void {
    this.mannschaftsMitglieder = response.payload;
    this.mannschaftsMitdliedRows = toTableRows(response.payload);
    this.loading = false;
  }

  private handleMannschaftsmitgliedFailure(response: Response<MannschaftsMitgliedDTO[]>): void {
    this.mannschaftsMitglieder = [];
    console.log('Error, could not load Mannschaftsmitglieder: ' + response);
    this.loading = false;
  }

  private filterMannschaften(): void {
    const filteredMannschaften = [];
    for (const mannschaft of this.mannschaften) {
      if (mannschaft.vereinId === this.currentVerein.id) {
        filteredMannschaften.push(mannschaft);
      }
    }
    this.mannschaften = filteredMannschaften;
  }

  public backClicked(): void {
    this.router.navigateByUrl('/vereine');
  }

  private navigateToMannschaft(mannschaft: DsbMannschaftDO) {
    this.router.navigateByUrl('/vereine/' + this.currentVerein.id + '/' + mannschaft.id);
  }
}
