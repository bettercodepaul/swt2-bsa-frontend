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
import {WETTKAMPF_TABLE_CONFIG} from './wettkampergebnis/tabelle.config';
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';
import {MatchDataProviderService} from '@vereine/services/match-data-provider.service';
import {MatchDO} from '@vereine/types/match-do.class';
import {DsbMitgliedDataProviderService} from '@verwaltung/services/dsb-mitglied-data-provider.service';
import {DsbMitgliedDO} from '@verwaltung/types/dsb-mitglied-do.class';
import {MannschaftsMitgliedDO} from '@verwaltung/types/mannschaftsmitglied-do.class';
import {MannschaftsmitgliedDataProviderService} from '@verwaltung/services/mannschaftsmitglied-data-provider.service';

@Component({
  selector: 'bla-mannschaft',
  templateUrl: './mannschaft.component.html'
})
export class MannschaftComponent extends CommonComponent implements OnInit {

  public config = MANNSCHAFT_CONFIG;
  public config_table = WETTKAMPF_TABLE_CONFIG;
  //public loadingTable = false;

  public vereine: Array<VereinDO> = [];
  public wettkaempfe: Array<WettkampfDO> = [];
  public veranstaltungen: Array<VeranstaltungDO> = [];
  public mannschaften: Array<DsbMannschaftDO> = [];
  public mannschaftsMitglieder: Array<MannschaftsMitgliedDO> = [];
  public matches: Array<MatchDO> = [];

  public currentVeranstaltung: VeranstaltungDO = new VeranstaltungDO();
  public currentVerein: VereinDO = new VereinDO();
  public currentMannschaft: DsbMannschaftDO = new DsbMannschaftDO();
  public rows: TableRow[];

  constructor(private wettkampfDataProvider: WettkampfDataProviderService,
    private veranstaltungsDataProvider: VeranstaltungDataProviderService,
    private vereinDataProvider: VereinDataProviderService,
    private mannschaftsDataProvider: DsbMannschaftDataProviderService,
    private matchDataProvider: MatchDataProviderService,
    private mannschaftsMitgliederDataProvider: MannschaftsmitgliedDataProviderService) {
    super();
  }

  ngOnInit() {
    this.loadVereine();
    this.loadWettkaempfe();
    this.loadVeranstaltungen();
    this.loadMannschaften();
    this.fillTableRows();
  }

  loadVereine() {
    this.vereinDataProvider.findAll()
        .then((response: BogenligaResponse<VereinDO[]>) => this.handleSuccessLoadVereine(response))
        .catch((response: BogenligaResponse<VereinDO[]>) => this.vereine == []);
  }

  handleSuccessLoadVereine(response: BogenligaResponse<VereinDO[]>) {
    this.vereine = response.payload;
    this.currentVerein = this.vereine[0];
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
    this.currentVeranstaltung = this.veranstaltungen[0];
    this.fillTableRows();

    console.log(this.rows);
  }


  loadMannschaften() {
    this.mannschaftsDataProvider.findAll()
        .then((response: BogenligaResponse<DsbMannschaftDO[]>) => this.handleSuccessLoadMannschaften(response))
        .catch((response: BogenligaResponse<DsbMannschaftDO[]>) => this.mannschaften = []);
  }


  handleSuccessLoadMannschaften(respone: BogenligaResponse<DsbMannschaftDO[]>) {
    this.mannschaften = respone.payload;
    this.currentMannschaft = this.mannschaften[0];
  }


  private fillTableRows(): void {
    this.rows = [];

    //this.rows = toTableRows(this.wettkaempfe);
    //this.rows = toTableRows(this.veranstaltungen);

    this.rows = toTableRows(this.wettkaempfe);

    console.log(this.rows);

  }


  public loadErgebnisse(): void {

    console.log("Ich werde aufgerufen");
    this.mannschaften = this.mannschaften.filter((m) => m.vereinId === this.currentVerein.id && m.veranstaltungId === this.currentVeranstaltung.id);
    this.currentMannschaft = this.mannschaften[0];

    this.loadMatches(this.currentMannschaft.id);
    console.log(this.currentMannschaft);

  }

  public loadMatches (id: number) {

    this.matchDataProvider.findAllbyMannschaftsID(id)
        .then((response: BogenligaResponse<MatchDO[]>) => this.handleSuccessLoadMatches(response))
        .catch((response: BogenligaResponse<MatchDO[]>) => this.matches = []);

  }

  handleSuccessLoadMatches(respone: BogenligaResponse<MatchDO[]>) {
    this.matches = respone.payload;
  }


  public loadMannschaftsMitglieder () {

    this.mannschaftsMitgliederDataProvider.findAll()
        .then((response: BogenligaResponse<MannschaftsMitgliedDO[]>) => this.handleSuccessLoadMitglieder(response))
        .catch((response: BogenligaResponse<MannschaftsMitgliedDO[]>) => this.mannschaftsMitglieder = []);

  }


  public handleSuccessLoadMitglieder(response: BogenligaResponse<MannschaftsMitgliedDO[]>) {
    this.mannschaftsMitglieder = response.payload;

  }

 }
