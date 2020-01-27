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
import {WettkampfErgebnisService} from '@wettkampf/services/wettkampf-ergebnis.service';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {isUndefined} from '@shared/functions';
import {DsbMannschaftDataProviderService} from '@verwaltung/services/dsb-mannschaft-data-provider.service';
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';

const ID_PATH_PARAM = 'id';
@Component({
  selector:    'bla-mannschaft',
  templateUrl: './wettkampf.component.html'
})
export class WettkampfComponent extends CommonComponent implements OnInit {

  public directVerein = null;
  public directMannschaft = null;
  public directWettkampf = null;
  public routes = null;
  public config = WETTKAMPF_CONFIG;
  public config_table = WETTKAMPF_TABLE_CONFIG;
  public loadingwettkampf = false;
  public Jahre: Array<number> = [];
  public currentJahr: number = 2018;
  public vereine: Array<VereinDO> = [];
  public mannschaften: Array<DsbMannschaftDO> = [];
  public veranstaltungen: Array<VeranstaltungDO> = [];
  public currentVeranstaltung: VeranstaltungDO = new VeranstaltungDO();
  public currentVerein: VereinDO = new VereinDO();
  private currentMannschaft: DsbMannschaftDO;
  public multipleSelections = true;
  public PLACEHOLDER_VAR = 'Bitte Veranstaltung wählen';
  // Because we have several match tables, we need an array of arrays for the several Rows in each Table
  public rows: Array<TableRow[]> = new Array<TableRow[]>();
  public wettkampErgebnisse: Array<WettkampfErgebnis[]> = new Array<WettkampfErgebnis[]>();


  constructor(private veranstaltungsDataProvider: VeranstaltungDataProviderService,
              private vereinDataProvider: VereinDataProviderService,
              private wettkampfErgebnisService: WettkampfErgebnisService,
              private mannschaftDataProvider: DsbMannschaftDataProviderService,
              private router: Router,
              private route: ActivatedRoute) {
              super();
  }

  ngOnInit() {
    this.route.params.subscribe((params)=>{
      if(!isUndefined(params[ID_PATH_PARAM])){
        const id = params[ID_PATH_PARAM];
        this.directWettkampf = id;
        this.directMannschaft = id;
        this.directMannschaft = this.directMannschaft.replace(/-/g, ' ');
        this.refresh();
      }
    });
    this.loadMannschaft();
    this.loadVeranstaltungen();


  }
  loadMannschaft() {
    this.mannschaftDataProvider.findAll()
        .then((response: BogenligaResponse<DsbMannschaftDO[]>) => this.handleSuccessLoadMannschaft(response))
        .catch((response: BogenligaResponse<DsbMannschaftDO[]>) => this.mannschaften === []);
  }

  handleSuccessLoadMannschaft(response: BogenligaResponse<DsbMannschaftDO[]>) {
    this.mannschaften = response.payload;
    if (this.directMannschaft != null) {
      for (const i of this.mannschaften) {
        if (this.directMannschaft === i.name) {
          this.currentMannschaft = i;
          break;
        }
        this.currentMannschaft = this.mannschaften[0];
      }
    } else {
      this.currentMannschaft = this.mannschaften[0];
    }
  }


  loadVereine() {
    this.vereinDataProvider.findAll()
        .then((response: BogenligaResponse<VereinDO[]>) => this.handleSuccessLoadVereine(response))
        .catch((response: BogenligaResponse<VereinDO[]>) => this.vereine === []);
  }

  handleSuccessLoadVereine(response: BogenligaResponse<VereinDO[]>) {
    const tableVisibility: HTMLInputElement = document.querySelector('#Table') as HTMLInputElement;
    tableVisibility.style.display = 'none';
    this.vereine = response.payload;
    if (this.directVerein != null) {
      for (const i of this.vereine) {
       if (this.directVerein === i.name) {
          this.currentVerein = i;
          break;
        }
        this.currentVerein = this.vereine[0];
      }
    } else {
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
      if (this.directWettkampf != null) {
       for (const i of this.veranstaltungen) {
        if (this.directWettkampf === i.name) {
          this.currentVeranstaltung = i;
          break;
        }
         this.currentVeranstaltung = this.veranstaltungen[0];
       }
      }
      else {
      this.currentVeranstaltung = this.veranstaltungen[0];
    }

      this.currentJahr = this.currentVeranstaltung.sportjahr;
      for (const i of this.veranstaltungen){
        if (this.Jahre.includes(i.sportjahr) === false){
          this.Jahre[this.Jahre.length] = i.sportjahr
        }
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
  public refresh() {
    const tableVisibility: HTMLInputElement = document.querySelector('#Table') as HTMLInputElement;
    tableVisibility.style.display = 'block';
    const buttonVisibility: HTMLInputElement = document.querySelector('#Button') as HTMLInputElement;
    buttonVisibility.style.display = 'none';
  }

  public loadErgebnisse() {
    const tableVisibility: HTMLInputElement = document.querySelector('#Table') as HTMLInputElement;
    tableVisibility.style.display = 'none';
    const buttonVisibility: HTMLInputElement = document.querySelector('#Button') as HTMLInputElement;
    buttonVisibility.style.display = 'block';
    this.wettkampErgebnisse = [];
    this.loadingwettkampf = true;
    console.log('loadErgebnisse');
    this.wettkampErgebnisse.push(this.wettkampfErgebnisService.createErgebnisse(this.currentJahr, this.currentMannschaft,
      this.mannschaften, this.currentVeranstaltung, 0));
    // waiting needs to be implemented, because it is necessary to load the values correct before continuing.
    this.delay(10).then((any) => {
      this.fillTableRows();
    });

  }

  public onSelect($event: VeranstaltungDO[]): void {
    const tableVisibility: HTMLInputElement = document.querySelector('#Table') as HTMLInputElement;
    tableVisibility.style.display = 'none';
    const buttonVisibility: HTMLInputElement = document.querySelector('#Button') as HTMLInputElement;
    buttonVisibility.style.display = 'block';
    this.wettkampErgebnisse = [];
    this.loadingwettkampf = true;
    console.log('loadErgebnisse');
    this.currentVeranstaltung = $event.concat()[0];

    let result;
    result = this.wettkampfErgebnisService.createErgebnisse(this.currentJahr, this.currentMannschaft,
      this.mannschaften, $event.concat()[0], 0);
    result = this.wettkampfErgebnisService.createWettkampfergebnisse(0);
    this.rows = [];
    this.wettkampErgebnisse = [];
    if (this.wettkampErgebnisse.push(result)) {
      // waiting needs to be implemented, because it is necessary to load the values correct before continuing.
      this.delay(10).then((any) => {
        this.fillTableRows();
      });
    }
  }

  async delay(ms: number) {
    await new Promise((resolve) => setTimeout(() => resolve(), ms)).then(() => console.log('fired'));
  }
}
