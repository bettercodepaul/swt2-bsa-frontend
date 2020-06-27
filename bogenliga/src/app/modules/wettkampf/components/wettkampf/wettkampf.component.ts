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
import {WettkampfDataProviderService} from '@wettkampf/services/wettkampf-data-provider.service';

const ID_PATH_PARAM = 'id';
@Component({
  selector:    'bla-mannschaft',
  templateUrl: './wettkampf.component.html'
})

export class WettkampfComponent extends CommonComponent implements OnInit {

  public show = false;
  public showAll: boolean;
  public directMannschaft = null;
  public directWettkampf = null;
  public routes = null;
  public config = WETTKAMPF_CONFIG;
  public config_table = WETTKAMPF_TABLE_CONFIG;
  public loadingwettkampf = false;
  public jahre: Array<number> = [];
  public currentJahr: number;
  public vereine: Array<VereinDO> = [];
  public mannschaften: Array<DsbMannschaftDO> = [];
  public veranstaltungen: Array<VeranstaltungDO> = [];
  public currentVeranstaltung: VeranstaltungDO = new VeranstaltungDO();
  public currentMannschaft: DsbMannschaftDO = new DsbMannschaftDO();
  public multipleSelections = true;
  // Because we have several match tables, we need an array of arrays for the several Rows in each Table
  public rows: Array<TableRow[]> = new Array<TableRow[]>();
  public wettkampErgebnisse: Array<WettkampfErgebnis[]> = new Array<WettkampfErgebnis[]>();
  public areVeranstaltungenloading = true;


  constructor(private veranstaltungsDataProvider: VeranstaltungDataProviderService,
              private vereinDataProvider: VereinDataProviderService,
              private wettkampfdataprovider: WettkampfDataProviderService,
              private wettkampfErgebnisService: WettkampfErgebnisService,
              private mannschaftDataProvider: DsbMannschaftDataProviderService,
              private router: Router,
              private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        const id = params[ID_PATH_PARAM];
        this.directWettkampf = id;
        this.directMannschaft = id;
        this.directMannschaft = this.directMannschaft.replace(/-/g, ' ');
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
          this.mannschaften[0] = i;
        }
        this.currentMannschaft = this.mannschaften[0];
      }
    } else if (this.currentMannschaft !== null) {
      this.currentMannschaft = this.mannschaften[0];
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
    } else {
      this.currentVeranstaltung = this.veranstaltungen[0];
    }
    this.areVeranstaltungenloading = false;


    this.currentJahr = this.currentVeranstaltung.sportjahr;
    this.loadJahre();
  }

  loadJahre() {
    for (const i of this.veranstaltungen) {
      if (this.jahre.includes(i.sportjahr) === false) {
        this.jahre[this.jahre.length] = i.sportjahr;
      }
    }
  }

  public refresh() {
    this.show = true;
  }

  public loadErgebnisse(selectedMannschaft: DsbMannschaftDO) {
    this.show = false;
    this.loading = false;
    console.log('loadErgebnisse');
    this.rows = [];
    let wettkampf = this.wettkampfErgebnisService.createErgebnisse(this.currentJahr, selectedMannschaft,
      this.mannschaften, this.currentVeranstaltung);
    console.log("Laenge: " + wettkampf.length);
    const amount = new Set(wettkampf.map(item => item.wettkampfId)).size;
    const safeLength = wettkampf.length;
    while(wettkampf.length > 0) {
      this.rows.push(toTableRows(wettkampf.splice(0, safeLength / amount)));
    }
    this.loading = true;
  }

  public onSelect($event: VeranstaltungDO[]): void {
    this.show = false;
    this.showAll = false;
    this.wettkampErgebnisse = [];
    this.rows = [];
    console.log('loadErgebnisse');
    this.currentVeranstaltung = $event.concat()[0];
    this.currentJahr = this.currentVeranstaltung.sportjahr;
    this.jahre[0] = this.currentJahr;
    let result;
    result = this.wettkampfErgebnisService.createErgebnisse(this.currentJahr, this.currentMannschaft,
      this.mannschaften, $event.concat()[0]);
    this.wettkampErgebnisse = [];
    if (this.wettkampErgebnisse.push(result)) {
      this.rows = [];
      this.rows.push(toTableRows(this.wettkampErgebnisse[0]));
    }
  }
}
