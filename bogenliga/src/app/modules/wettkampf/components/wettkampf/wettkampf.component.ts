import {Component, OnInit} from '@angular/core';
import {WETTKAMPF_CONFIG} from './wettkampf.config';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';
import {VereinDataProviderService} from '@verwaltung/services/verein-data-provider.service';
import {CommonComponent, toTableRows} from '@shared/components';
import {VereinDO} from '@verwaltung/types/verein-do.class';
import {BogenligaResponse} from '@shared/data-provider';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {VeranstaltungDTO} from '@verwaltung/types/datatransfer/veranstaltung-dto.class';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {WETTKAMPF_TABLE_CONFIG} from './wettkampergebnis/tabelle.config';
import {WettkampfErgebnis} from './wettkampergebnis/WettkampfErgebnis';
import {WettkampfErgebnisService} from './wettkampergebnis/WettkampfErgebnis.Service';

@Component({
  selector:    'bla-mannschaft',
  templateUrl: './wettkampf.component.html'
})
export class WettkampfComponent extends CommonComponent implements OnInit {

  public config = WETTKAMPF_CONFIG;
  public config_table = WETTKAMPF_TABLE_CONFIG;

  public vereine: Array<VereinDO> = [];
  public veranstaltungen: Array<VeranstaltungDO> = [];
  public currentVeranstaltung: VeranstaltungDTO = new VeranstaltungDTO();
  public currentVeranstaltungDO: VeranstaltungDO = new VeranstaltungDO();
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
        .catch((response: BogenligaResponse<VeranstaltungDO[]>) => this.veranstaltungen = []);

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

  public loadErgebnisse() {
    console.log('loadErgebnisse');

    this.currentVeranstaltungDO = new VeranstaltungDO();

    this.currentVeranstaltungDO.id = this.currentVeranstaltung.id;
    this.currentVeranstaltungDO.wettkampfTypId = this.currentVeranstaltung.wettkampfTypId;
    this.currentVeranstaltungDO.name = this.currentVeranstaltung.name;
    this.currentVeranstaltungDO.sportjahr = this.currentVeranstaltung.sportjahr;
    this.currentVeranstaltungDO.meldeDeadline = this.currentVeranstaltung.meldeDeadline;
    this.currentVeranstaltungDO.ligaleiterId = this.currentVeranstaltung.ligaleiterId;
    this.currentVeranstaltungDO.ligaId = this.currentVeranstaltung.ligaId;
    this.currentVeranstaltungDO.version = this.currentVeranstaltung.version;
    this.currentVeranstaltungDO.ligaleiterEmail = this.currentVeranstaltung.ligaleiterEmail;
    this.currentVeranstaltungDO.wettkampftypName = this.currentVeranstaltung.wettkampftypName;
    this.currentVeranstaltungDO.ligaName = this.currentVeranstaltung.ligaName;

    this.wettkampErgebnisse.push(this.wettkampfErgebnisService.createErgebnisse(this.currentVerein,
      this.vereine, this.currentVeranstaltung, 0));
    // waiting needs to be implemented, because it is necessary to load the values correct before continuing.
    this.fillTableRows();

  }

 }
