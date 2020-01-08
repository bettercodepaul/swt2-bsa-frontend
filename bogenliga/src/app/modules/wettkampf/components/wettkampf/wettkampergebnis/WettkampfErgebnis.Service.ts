import {WettkampfErgebnis} from './WettkampfErgebnis';
import {VereinDO} from '@verwaltung/types/verein-do.class';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {MatchDO} from '@verwaltung/types/match-do.class';
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';
import {WettkampfDO} from '@verwaltung/types/wettkampf-do.class';
import {BogenligaResponse} from '@shared/data-provider';
import {DsbMannschaftDataProviderService} from '@verwaltung/services/dsb-mannschaft-data-provider.service';
import {MatchDataProviderService} from '@verwaltung/services/match-data-provider.service';
import {WettkampfDataProviderService} from '@verwaltung/services/wettkampf-data-provider.service';
import {Injectable} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class WettkampfErgebnisService {
  // Input
  public verein: VereinDO;
  public allVereine: VereinDO[];
  public veranstaltung: VeranstaltungDO;

  // Output
  public wettkampErgebnisse: WettkampfErgebnis[];

  // toLoad
  public matches: Array<MatchDO> = [];
  public mannschaften: Array<DsbMannschaftDO> = [];
  public wettkaempfe: Array<WettkampfDO> = [];
  public currentManschaft: DsbMannschaftDO;
  private loading = false;

  constructor(private wettkampfDataProvider: WettkampfDataProviderService,
              private mannschaftsDataProvider: DsbMannschaftDataProviderService,
              private matchDataProvider: MatchDataProviderService) {

  }

  public createErgebnisse(verein: VereinDO, allVereine: VereinDO[], veranstaltung: VeranstaltungDO, match: number): WettkampfErgebnis[] {
       this.setupService(verein, allVereine, veranstaltung);
       return this.wettkampErgebnisse;

  }

  private setupService(verein: VereinDO, allVereine: VereinDO[], veranstaltung: VeranstaltungDO) {
    this.verein = verein;
    this.veranstaltung = veranstaltung;
    this.allVereine = allVereine;
    this.loadWettkaempfe();
  }

  public createWettkampfergebnisse(match: number): WettkampfErgebnis[] {
    this.wettkampErgebnisse = [];
    console.log(this.matches);
    this.matches.filter((ma) => ma.mannschaftId === this.currentManschaft.id)
        .forEach((currentMatch) => {
          const wettkampfErgebnis = new WettkampfErgebnis(this.verein.name, 0, 1,
            2, 3, 4, 'Hallo', 1, 2,
            3, 4, 5, '' + currentMatch.satzpunkte, '' + currentMatch.matchpunkte);
          // console.log(wettkampfErgebnis);
          this.wettkampErgebnisse.push(wettkampfErgebnis);

        });
    return this.wettkampErgebnisse;

  }

  loadWettkaempfe() {
    this.wettkampfDataProvider.findAll()
        .then((response: BogenligaResponse<WettkampfDO[]>) => this.handleLoadWettkaempfe(response.payload))
        .catch((response: BogenligaResponse<VereinDO[]>) => this.handleLoadWettkaempfe([]));
  }

  handleLoadWettkaempfe(wettkaempfe: WettkampfDO[]) {
    this.wettkaempfe = wettkaempfe;
    this.loadMannschaften();
  }

  loadMannschaften() {
    this.mannschaftsDataProvider.findAll()
        .then((response: BogenligaResponse<DsbMannschaftDO[]>) => this.handleLoadMannschaften(response.payload))
        .catch((response: BogenligaResponse<DsbMannschaftDO[]>) => this.handleLoadMannschaften([]));
  }

  handleLoadMannschaften(mannschaften: DsbMannschaftDO[]) {
    this.mannschaften = mannschaften;
    this.loading = false;

    this.loadMatches();
  }

  private filterMannschaften() {
    this.currentManschaft = this.mannschaften.filter((mannschaft) => mannschaft.veranstaltungId === this.veranstaltung.id
      && mannschaft.vereinId === this.verein.id)[0];
  }

  public loadMatches() {
    this.matchDataProvider.findAll()
        .then((response: BogenligaResponse<MatchDO[]>) => this.handleLoadMatches(response.payload))
        .catch((response: BogenligaResponse<MatchDO[]>) => this.handleLoadMatches([]));
  }

  handleLoadMatches(matches: MatchDO[]): WettkampfErgebnis[] {
    this.matches = matches;
    this.filterMannschaften();
    return this.createWettkampfergebnisse(0);
  }

}


