import {WettkampfErgebnis} from '@wettkampf/components/wettkampf/wettkampergebnis/WettkampfErgebnis';
import {VereinDO} from '@verwaltung/types/verein-do.class';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {MatchDO} from '@verwaltung/types/match-do.class';
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';
import {WettkampfDO} from '@verwaltung/types/wettkampf-do.class';
import {PasseDoClass} from '@verwaltung/types/passe-do-class';
import {BogenligaResponse} from '@shared/data-provider';
import {DsbMannschaftDataProviderService} from '@verwaltung/services/dsb-mannschaft-data-provider.service';
import {MatchDataProviderService} from '@verwaltung/services/match-data-provider.service';
import {WettkampfDataProviderService} from '@verwaltung/services/wettkampf-data-provider.service';
import {PasseDataProviderService} from '@verwaltung/services/passe-data-provider-service';
import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {UserPermission} from '@shared/services';
import {unwrapFirst} from 'codelyzer/util/function';


@Injectable({
  providedIn: 'root'
})
export class WettkampfErgebnisService {
  // Input
  public verein: VereinDO;
  public veranstaltung: VeranstaltungDO;
  public sportjahr: number;
  public match: number;

  // Output
  public wettkampErgebnisse: WettkampfErgebnis[] = [];

  // toLoad
  public matches: Array<MatchDO> = [];
  public mannschaften: Array<DsbMannschaftDO> = [];
  public wettkaempfe: Array<WettkampfDO> = [];
  public currentMannschaft: DsbMannschaftDO;
  private loading = false;
  private passen: Array<PasseDoClass> = [];

  constructor(private wettkampfDataProvider: WettkampfDataProviderService,
              private mannschaftsDataProvider: DsbMannschaftDataProviderService,
              private matchDataProvider: MatchDataProviderService,
              private passeDataProvider: PasseDataProviderService) {

  }

  public getMannschaftsname(id: number): string {

    for (const mannschaften of this.mannschaften) {
      if (mannschaften.id === id) {
        return mannschaften.name;
      }
    }
  }

  public getSatzergebnis(nr: number, satznummer: number, id: number): number {

    let Satz = 0;
    const passenFil = this.passen.filter((passenFiltered) => passenFiltered.matchNr === nr && passenFiltered.lfdNr === satznummer && id === passenFiltered.mannschaftId);
    for (const passe of passenFil) {
        for (const i of passe.ringzahl) {
          Satz += i;
        }
    }
    return Satz;
  }

  public getSatzpunkte(nr: number): string {

    let satzpunkte1 = '-';
    let satzpunkte2 = '-';
    if (this.matches[nr].satzpunkte != null) {
      satzpunkte1 = String(this.matches[nr].satzpunkte);
    }
    if (this.matches[nr + 1].satzpunkte != null) {
      satzpunkte2 = String(this.matches[nr + 1].satzpunkte);
    }
    return satzpunkte1 + ' : ' + satzpunkte2;
  }

  public getMatchpunkte(nr: number): string {

    let matchpunkte1 = '-';
    let matchpunkte2 = '-';

    if (this.matches[nr].matchpunkte != null) {
      matchpunkte1 = String(this.matches[nr].matchpunkte);
    }
    if (this.matches[nr + 1].matchpunkte != null) {
      matchpunkte2 = String(this.matches[nr + 1].matchpunkte);
    }
    return matchpunkte1 + ' : ' + matchpunkte2;
  }

  public createErgebnisse(jahr: number, mannschaft: DsbMannschaftDO, allMannschaften: DsbMannschaftDO[], veranstaltung: VeranstaltungDO): WettkampfErgebnis[] {

    this.currentMannschaft = mannschaft;
    this.veranstaltung = veranstaltung;
    this.mannschaften = allMannschaften;
    this.sportjahr = jahr;
    this.loadWettkaempfe(this.veranstaltung.id);
    if (this.currentMannschaft !== undefined) {
      this.matches = this.filterMannschaft();
    }
    return this.createWettkampfergebnisse();
  }

  public filterMannschaft(): Array<MatchDO> {

    const mannschaftMatches: Array<MatchDO> = [];
    for (let i = 0; i < this.matches.length; i += 2) {
      if (this.currentMannschaft.id === this.matches[i].mannschaftId || this.currentMannschaft.id === this.matches[i + 1].mannschaftId) {
        mannschaftMatches.push(this.matches[i]);
        mannschaftMatches.push(this.matches[i + 1]);
      }
    }
    return mannschaftMatches;
  }

  public createWettkampfergebnisse(): WettkampfErgebnis[] {

    this.wettkampErgebnisse = [];
    for (let i = 0; i < this.matches.length ; i = i + 2) {
      const wettkampfErgebnis = new WettkampfErgebnis (
        this.matches[i].nr,
        this.matches[i].wettkampfId,
        this.getMannschaftsname(this.matches[i].mannschaftId),
        this.getSatzergebnis(this.matches[i].nr, 1, this.matches[i].mannschaftId),
        this.getSatzergebnis(this.matches[i].nr, 2, this.matches[i].mannschaftId),
        this.getSatzergebnis(this.matches[i].nr, 3, this.matches[i].mannschaftId),
        this.getSatzergebnis(this.matches[i].nr, 4, this.matches[i].mannschaftId),
        this.getSatzergebnis(this.matches[i].nr, 5, this.matches[i].mannschaftId),
        this.getMannschaftsname(this.matches[i + 1].mannschaftId),
        this.getSatzergebnis(this.matches[i + 1].nr, 1, this.matches[i + 1].mannschaftId),
        this.getSatzergebnis(this.matches[i + 1].nr, 2, this.matches[i + 1].mannschaftId),
        this.getSatzergebnis(this.matches[i + 1].nr, 3, this.matches[i + 1].mannschaftId),
        this.getSatzergebnis(this.matches[i + 1].nr, 4, this.matches[i + 1].mannschaftId),
        this.getSatzergebnis(this.matches[i + 1].nr, 5, this.matches[i + 1].mannschaftId),
        this.getSatzpunkte(i),
        this.getMatchpunkte(i)
      );
      this.wettkampErgebnisse.push(wettkampfErgebnis);
    }
    this.matches = [];
    this.passen = [];
    this.wettkaempfe = [];
    return this.wettkampErgebnisse;

  }

  // backend-calls to get data from DB
  public loadWettkaempfe(veranstaltungsId: number) {

    this.wettkampfDataProvider.findAllByVeranstaltungId(veranstaltungsId)
        .then((response: BogenligaResponse<WettkampfDO[]>) => this.handleLoadWettkaempfe(response.payload))
        .catch((response: BogenligaResponse<VereinDO[]>) => this.handleLoadWettkaempfe([]));
  }

  handleLoadWettkaempfe(wettkaempfe: WettkampfDO[]) {

    console.log('Wettkaempfe geladen: ' + wettkaempfe);
    this.wettkaempfe = wettkaempfe;
    this.wettkaempfe.forEach((wettkampfDO) => {
        this.loadMatches(wettkampfDO.id);
        this.loadPassen(wettkampfDO.id);
      });
  }

  public loadMatches(wettkampfId: number) {

    this.matchDataProvider.findAllWettkampfMatchesById(wettkampfId)
        .then((response: BogenligaResponse<MatchDO[]>) => this.handleLoadMatches(response.payload))
        .catch((response: BogenligaResponse<MatchDO[]>) => this.handleLoadMatches([]));
  }

  public loadPassen(wettkampfId: number) {

    this.passeDataProvider.findByWettkampfId(wettkampfId)
        .then((response: BogenligaResponse<PasseDoClass[]>) => this.handleLoadPassen(response.payload))
        .catch((response: BogenligaResponse<PasseDoClass[]>) => this.handleLoadPassen([]));
  }

  handleLoadMatches(matches: MatchDO[]) {

    console.log('Matches geladen: ' + matches);
    this.matches = this.matches.concat(matches);
  }

  handleLoadPassen(passen: PasseDoClass[]): void {

    console.log('Passen geladen: ' + passen);
    this.passen = this.passen.concat(passen);
  }
}
