import {Component, OnInit} from '@angular/core';
import {MANNSCHAFT_CONFIG} from './mannschaft.config';
import {VeranstaltungDataProviderService} from '@vereine/services/veranstaltung-data-provider.service';
import {VereinDataProviderService} from '@vereine/services/verein-data-provider.service';
import {CommonComponent, toTableRows} from '@shared/components';
import {VereinDO} from '@vereine/types/verein-do.class';
import {BogenligaResponse} from '@shared/data-provider';
import {VeranstaltungDO} from '@vereine/types/veranstaltung-do.class';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {WETTKAMPF_TABLE_CONFIG} from './wettkampergebnis/tabelle.config';
import {WettkampfErgebnis} from './wettkampergebnis/WettkampfErgebnis';
import {WettkampfErgebnisService} from './wettkampergebnis/WettkampfErgebnis.Service';

@Component({
  selector: 'bla-mannschaft',
  templateUrl: './mannschaft.component.html'
})
export class MannschaftComponent extends CommonComponent implements OnInit {

  public config = MANNSCHAFT_CONFIG;
  public config_table = WETTKAMPF_TABLE_CONFIG;

  public vereine: Array<VereinDO> = [];
  public veranstaltungen: Array<VeranstaltungDO> = [];
  public currentVeranstaltung: VeranstaltungDO = new VeranstaltungDO();
  public currentVerein: VereinDO = new VereinDO();

  // Because we have several match tables, we need an array of arrays for the several Rows in each Table
  public rows: Array<TableRow[]> = new Array<TableRow[]>();
  public wettkampErgebnisse: Array<WettkampfErgebnis[]> = new Array<WettkampfErgebnis[]>();


  constructor(private veranstaltungsDataProvider: VeranstaltungDataProviderService,
              private vereinDataProvider: VereinDataProviderService,
              private wettkampfErgebnisService: WettkampfErgebnisService) {
    super();
  }

  ngOnInit() {
    this.loadVereine();
    this.loadVeranstaltungen();
  }

  loadVereine() {
    this.vereinDataProvider.findAll()
        .then((response: BogenligaResponse<VereinDO[]>) => this.handleSuccessLoadVereine(response))
        .catch((response: BogenligaResponse<VereinDO[]>) => this.vereine === []);
  }

  handleSuccessLoadVereine(response: BogenligaResponse<VereinDO[]>) {
    this.vereine = response.payload;
    this.currentVerein = this.vereine[0];
  }

  loadVeranstaltungen() {
    this.veranstaltungsDataProvider.findAll()
        .then((response: BogenligaResponse<VeranstaltungDO[]>) => this.handleSuccessLoadVeranstaltungen(response))
        .catch((response: BogenligaResponse<VereinDO[]>) => this.veranstaltungen = []);

  }

  handleSuccessLoadVeranstaltungen(respone: BogenligaResponse<VeranstaltungDO[]>) {
    this.veranstaltungen = respone.payload;
    this.currentVeranstaltung = this.veranstaltungen[0];
  }


  private fillTableRows(): void {
    this.rows = [];
    console.log('Ergebnisse an 0:');
    console.log(this.wettkampErgebnisse[0]);

    this.rows.push(toTableRows(this.wettkampErgebnisse[0]));
    console.log('tableRows:');
    console.log(this.rows);

  }

  private loadErgebnisse() {
    console.log('loadErgebnisse');

    this.wettkampErgebnisse.push(this.wettkampfErgebnisService.createErgebnisse(this.currentVerein,
      this.vereine, this.currentVeranstaltung, 0));
    // waiting needs to be implemented, because it is necessary to load the values correct before continuing.
    this.fillTableRows();

  }

 }
