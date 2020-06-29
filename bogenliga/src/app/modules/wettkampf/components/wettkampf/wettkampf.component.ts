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
import {MatchDataProviderService} from '@verwaltung/services/match-data-provider.service';
import {WettkampfDataProviderService} from '@verwaltung/services/wettkampf-data-provider.service';
import {PasseDataProviderService} from '@verwaltung/services/passe-data-provider-service';
import {WettkampfDO} from '@verwaltung/types/wettkampf-do.class';
import {MatchDO} from '@verwaltung/types/match-do.class';
import {PasseDoClass} from '@verwaltung/types/passe-do-class';

const ID_PATH_PARAM = 'id';
@Component({
  selector:    'bla-mannschaft',
  templateUrl: './wettkampf.component.html'
})

export class WettkampfComponent extends CommonComponent implements OnInit {

  public show = false;
  public directMannschaft = null;
  public directWettkampf = null;
  public routes = null;
  public config = WETTKAMPF_CONFIG;
  public config_table = WETTKAMPF_TABLE_CONFIG;
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
  public areVeranstaltungenloading = true;
  public loadingData = false;
  public matches: Array<MatchDO> = [];
  public wettkaempfe: Array<WettkampfDO> = [];
  private passen: Array<PasseDoClass> = [];


  constructor(private veranstaltungsDataProvider: VeranstaltungDataProviderService,
              private vereinDataProvider: VereinDataProviderService,
              private wettkampfDataProviderService: WettkampfDataProviderService,
              private matchDataProviderService: MatchDataProviderService,
              private passeDataProviderService: PasseDataProviderService,
              private wettkampfErgebnisService: WettkampfErgebnisService,
              private mannschaftDataProvider: DsbMannschaftDataProviderService,
              private router: Router,
              private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        const id = parseInt(params[ID_PATH_PARAM], 10);
        this.directWettkampf = id;
        this.directMannschaft = id;
        this.directMannschaft = this.directMannschaft.replace(/-/g, ' ');
      }
    });
    this.loadVeranstaltungen();
  }

  public loadErgebnisse(selectedMannschaft: DsbMannschaftDO) {

    console.log('loadErgebnisse');
    this.rows = [];
    let wettkampf = this.wettkampfErgebnisService.createErgebnisse(this.currentJahr, selectedMannschaft,
      this.mannschaften, this.currentVeranstaltung, this.matches, this.wettkaempfe, this.passen,);
    console.log("wettkampf.length: " + wettkampf.length);
    const amount = new Set(wettkampf.map(item => item.wettkampfId)).size;
    const safeLength = wettkampf.length;
    while(wettkampf.length > 0) {
      this.rows.push(toTableRows(wettkampf.splice(0, safeLength / amount)));
    }
    console.log("rows.length: " + this.rows.length);
  }

  public onSelect($event: VeranstaltungDO[]): void {
    console.log('loadErgebnisse');
    this.currentVeranstaltung = $event.concat()[0];
    this.currentJahr = this.currentVeranstaltung.sportjahr;
    this.jahre[0] = this.currentJahr;
    this.clear();
  }

  private clear() {
    this.rows = [];
    this.wettkaempfe = [];
    this.matches = [];
    this.passen = [];
  }

  // backend-calls to get data from DB
  public loadVeranstaltungen() {
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
    this.loadMannschaft();
    this.loadJahre();
  }

  public loadMannschaft() {
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

  public loadJahre() {
    for (const i of this.veranstaltungen) {
      if (this.jahre.includes(i.sportjahr) === false) {
        this.jahre[this.jahre.length] = i.sportjahr;
      }
    }
  }

  public loadWettkaempfe(veranstaltungsId: number) {
    this.loadingData = true;
    this.wettkampfDataProviderService.findAllByVeranstaltungId(veranstaltungsId)
        .then((response: BogenligaResponse<WettkampfDO[]>) => this.handleLoadWettkaempfe(response.payload))
        .catch((response: BogenligaResponse<VereinDO[]>) => this.handleLoadWettkaempfe([]));
  }

  handleLoadWettkaempfe(wettkaempfe: WettkampfDO[]) {

    this.wettkaempfe = wettkaempfe;
    if(wettkaempfe.length > 0) {
      this.wettkaempfe.forEach((wettkampfDO) => {
        this.loadMatches(wettkampfDO.id);
      });
    }
    this.loadingData = false;
    console.log("This.matches: " + this.matches.length);
    console.log("This.passen: " + this.passen.length);
  }

  public loadMatches(wettkampfId: number) {

    this.matchDataProviderService.findByWettkampfId(wettkampfId)
        .then((response: BogenligaResponse<MatchDO[]>) => this.handleSuccessLoadMatches(response.payload, wettkampfId))
        .catch((response: BogenligaResponse<MatchDO[]>) => this.handleSuccessLoadMatches([], wettkampfId));
  }


  handleSuccessLoadMatches(matches: MatchDO[], wettkampfId) {

    this.matches = this.matches.concat(matches);
    console.log("This.matches Inside: " + this.matches.length);
    this.loadPassen(wettkampfId);
  }

  public loadPassen(wettkampfId) {
    this.passeDataProviderService.findByWettkampfId(wettkampfId)
        .then((response: BogenligaResponse<PasseDoClass[]>) => this.handleSuccessLoadPassen(response.payload))
        .catch((response: BogenligaResponse<PasseDoClass[]>) => this.handleSuccessLoadPassen([]));
  }

  handleSuccessLoadPassen(passen: PasseDoClass[]): void {
    //console.log('Passen geladen: ' + passen);
    this.passen = this.passen.concat(passen);
    console.log("This.passen Inside: " + this.passen.length);

  }
}
