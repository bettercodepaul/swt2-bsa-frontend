import {Component, OnInit} from '@angular/core';
import {WETTKAMPF_CONFIG} from './wettkampf.config';
import {VeranstaltungDataProviderService} from '@verwaltung/services/veranstaltung-data-provider.service';
import {VereinDataProviderService} from '@verwaltung/services/verein-data-provider.service';
import {CommonComponent, toTableRows} from '@shared/components';
import {VereinDO} from '@verwaltung/types/verein-do.class';
import {BogenligaResponse} from '@shared/data-provider';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {TableRow} from '@shared/components/tables/types/table-row.class';
import {WETTKAMPF_TABLE_CONFIG} from './wettkampergebnis/tabelle.config';
import {WettkampfErgebnis} from './wettkampergebnis/WettkampfErgebnis';
import {WettkampfErgebnisService} from './wettkampergebnis/WettkampfErgebnis.Service';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationService} from '@shared/services';

@Component({
  selector:    'bla-mannschaft',
  templateUrl: './wettkampf.component.html'
})
export class WettkampfComponent extends CommonComponent implements OnInit {
  private selectedVeranstaltungId: number;

  public directVerein = null;
  public directWettkampf = null;
  public config = WETTKAMPF_CONFIG;
  public config_table = WETTKAMPF_TABLE_CONFIG;
  public loadingwettkampf = false;
  public vereine: Array<VereinDO> = [];
  public veranstaltungen: Array<VeranstaltungDO> = [];
  public currentVeranstaltung: VeranstaltungDO = new VeranstaltungDO();
  public currentVerein: VereinDO = new VereinDO();
  public multipleSelections = true;
  public PLACEHOLDER_VAR = "Bitte Veranstaltung wählen"
  // Because we have several match tables, we need an array of arrays for the several Rows in each Table
  public rows: Array<TableRow[]> = new Array<TableRow[]>();
  public wettkampErgebnisse: Array<WettkampfErgebnis[]> = new Array<WettkampfErgebnis[]>();


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private veranstaltungsDataProvider: VeranstaltungDataProviderService,
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
    if (this.directVerein != null){
      for(let i = 0; i < this.vereine.length; i++){
        if (this.directVerein == this.vereine[i].name){
          this.currentVerein = this.vereine[i];
        }}
    }else {
      this.currentVerein = this.vereine[0];
    }
  }

  loadVeranstaltungen() {
    this.veranstaltungsDataProvider.findAll()
        .then((response: BogenligaResponse<VeranstaltungDO[]>) => this.handleSuccessLoadVeranstaltungen(response))
        .catch((response: BogenligaResponse<VeranstaltungDO[]>) => this.veranstaltungen = []);

  }

  handleSuccessLoadVeranstaltungen(response: BogenligaResponse<VeranstaltungDO[]>) {
    this.veranstaltungen = response.payload;
    if (this.directWettkampf != null){
      for(let i = 0; i < this.veranstaltungen.length; i++){
        if (this.directWettkampf == this.veranstaltungen[i].name){
          this.currentVeranstaltung = this.veranstaltungen[i];
        }}
    }else {
      this.currentVeranstaltung = this.veranstaltungen[0];
    }
  }


  private fillTableRows(): void {
    this.rows = [];
    console.log('Ergebnisse an 0:');
    console.log(this.wettkampErgebnisse[0]);

    this.rows.push(toTableRows(this.wettkampErgebnisse[0]));
    console.log('tableRows:');
    console.log(this.rows);
    this.loadingwettkampf = false;

  }

  public loadErgebnisse() {
    this.rows = [];
    this.wettkampErgebnisse = [];
    this.loadingwettkampf = true;
    console.log('loadErgebnisse');
    this.wettkampErgebnisse.push(this.wettkampfErgebnisService.createErgebnisse(this.currentVerein,
      this.vereine, this.currentVeranstaltung, 0));
    // waiting needs to be implemented, because it is necessary to load the values correct before continuing.
    this.delay(10).then(any => {
      this.fillTableRows();
    });

  }
  public onSelect($event: VeranstaltungDO[]): void {
    this.wettkampErgebnisse = [];
    this.loadingwettkampf = true;
    console.log('loadErgebnisse');
    this.currentVeranstaltung =$event.concat()[0] ;

    let result;
    result = this.wettkampfErgebnisService.createErgebnisse(this.currentVerein,
      this.vereine, $event.concat()[0], 0)
    result = this.wettkampfErgebnisService.createWettkampfergebnisse(0);
    this.rows = [];
    this.wettkampErgebnisse = [];
    this.rows.push((result));
    if(this.wettkampErgebnisse.push(result)) {

      // waiting needs to be implemented, because it is necessary to load the values correct before continuing.
      this.delay(10).then(any => {
        this.fillTableRows();
      });
    }
  }
  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
  }
}

