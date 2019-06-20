import {Component, OnInit} from '@angular/core';
import {MANNSCHAFT_CONFIG} from './mannschaft.config';
import {WettkampfDataProviderService} from '@vereine/services/wettkampf-data-provider.service';
import {VeranstaltungDataProviderService} from '@vereine/services/veranstaltung-data-provider.service';
import {VereinDataProviderService} from '@vereine/services/verein-data-provider.service';
import {DsbMannschaftDataProviderService} from '@verwaltung/services/dsb-mannschaft-data-provider.service';
import {CommonComponent, toTableRows} from '@shared/components';
import {VereinDO} from '@vereine/types/verein-do.class';
import {BogenligaResponse} from '@shared/data-provider';
import {RegionDO} from '@verwaltung/types/region-do.class';
import {RegionDTO} from '@verwaltung/types/datatransfer/region-dto.class';
import {VereinDTO} from '@verwaltung/types/datatransfer/verein-dto.class';
import {WettkampfDO} from '@vereine/types/wettkampf-do.class';
import {VeranstaltungDO} from '@vereine/types/veranstaltung-do.class';
import {TableRow} from '@shared/components/tables/types/table-row.class';

@Component({
  selector: 'bla-mannschaft',
  templateUrl: './mannschaft.component.html'
})
export class MannschaftComponent extends CommonComponent implements OnInit {

  public config = MANNSCHAFT_CONFIG;

  public vereine: Array<VereinDO> = [];
  public wettkaempfe: Array<WettkampfDO> = [];
  public veranstaltungen: Array<VeranstaltungDO> = [];
  public rows: TableRow[];

  constructor(private wettkampfDataProvider: WettkampfDataProviderService,
    private veranstaltungsDataProvider: VeranstaltungDataProviderService,
    private vereinDataProvider: VereinDataProviderService,
    private mannschaftsDataProvider: DsbMannschaftDataProviderService) {
    super();
  }

  ngOnInit() {
    this.loadVereine();
    this.loadWettkaempfe();
    this.loadVeranstaltungen();
    this.fillTableRows();
  }

  loadVereine() {
    this.vereinDataProvider.findAll()
        .then((response: BogenligaResponse<VereinDO[]>) => this.handleSuccessLoadVereine(response))
        .catch((response: BogenligaResponse<VereinDO[]>) => this.vereine == []);
  }

  handleSuccessLoadVereine(response: BogenligaResponse<VereinDO[]>) {
    this.vereine = response.payload;
    console.log(this.vereine);
  }


  loadWettkaempfe() {
    this.wettkampfDataProvider.findAll()
        .then((response: BogenligaResponse<WettkampfDO[]>) => this.handleSuccessLoadWettkaempfe(response))
        .catch((response: BogenligaResponse<VereinDO[]>) => this.wettkaempfe == []);

  }


  handleSuccessLoadWettkaempfe(response: BogenligaResponse<WettkampfDO[]>) {
    this.wettkaempfe = response.payload;
  }


  loadVeranstaltungen() {
    this.veranstaltungsDataProvider.findAll()
        .then((response: BogenligaResponse<VeranstaltungDO[]>) => this.handleSuccessLoadVeranstaltungen(response))
        .catch((response: BogenligaResponse<VereinDO[]>) => this.veranstaltungen = []);

  }


  handleSuccessLoadVeranstaltungen(respone: BogenligaResponse<VeranstaltungDO[]>) {
    this.veranstaltungen = respone.payload;

  }


  private fillTableRows(): void {
    this.rows = [];

    if (this.wettkaempfe.length < 6) {
      this.rows = toTableRows(this.wettkaempfe);
      console.log("fillTableRows if");
    } else {
      this.rows = toTableRows(this.wettkaempfe.slice(0, 5));
    }
  }
 }
