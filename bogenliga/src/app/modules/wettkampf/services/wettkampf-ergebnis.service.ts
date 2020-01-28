import {WettkampfErgebnis} from '@wettkampf/components/wettkampf/wettkampergebnis/WettkampfErgebnis';
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
  public veranstaltung: VeranstaltungDO;
  public sportjahr: Number

  // Output
  public wettkampErgebnisse: WettkampfErgebnis[];

  // toLoad
  public matches: Array<MatchDO> = [];
  public mannschaften: Array<DsbMannschaftDO> = [];
  public wettkaempfe: Array<WettkampfDO> = [];
  public currentManschaft: DsbMannschaftDO = null;

  constructor(private wettkampfDataProvider: WettkampfDataProviderService,
              private mannschaftsDataProvider: DsbMannschaftDataProviderService,
              private matchDataProvider: MatchDataProviderService) {

  }

  public createErgebnisse(jahr: number, mannschaft: DsbMannschaftDO, allMannschaften: DsbMannschaftDO[], veranstaltung: VeranstaltungDO, match: number): WettkampfErgebnis[] {
    this.setupService(jahr, mannschaft, allMannschaften, veranstaltung);
    return this.wettkampErgebnisse;

  }

  private setupService(jahr: number, mannschaft: DsbMannschaftDO, allMannschaften: DsbMannschaftDO[], veranstaltung: VeranstaltungDO) {
    this.currentManschaft = mannschaft;
    this.veranstaltung = veranstaltung;
    this.mannschaften = allMannschaften;
    this.sportjahr = jahr
    this.loadWettkaempfe();
  }

  public createWettkampfergebnisse(match: number): WettkampfErgebnis[] {
    this.wettkampErgebnisse = [];
    console.log(this.matches);
    this.matches.filter((ma) => ma.mannschaftId === this.currentManschaft.id)
        .forEach((currentMatch) => {
          const wettkampfErgebnis = new WettkampfErgebnis(0,this.currentManschaft.name, currentMatch.begegnung, 1,
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
    this.loadMatches();
  }


  private filterMannschaften() {
    this.currentManschaft = this.mannschaften.filter((mannschaft) => mannschaft.veranstaltungId === this.veranstaltung.id
      && this.veranstaltung.sportjahr === this.sportjahr)[0];
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





