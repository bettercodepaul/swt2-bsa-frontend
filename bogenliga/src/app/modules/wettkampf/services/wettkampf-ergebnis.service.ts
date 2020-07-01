import {WettkampfErgebnis} from '@wettkampf/components/wettkampf/wettkampergebnis/WettkampfErgebnis';
import {VereinDO} from '@verwaltung/types/verein-do.class';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {MatchDO} from '@verwaltung/types/match-do.class';
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';
import {PasseDoClass} from '@verwaltung/types/passe-do-class';
import {Injectable} from '@angular/core';

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
  public currentMannschaft: DsbMannschaftDO;
  private passen: Array<PasseDoClass> = [];

  constructor() {

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

  public createErgebnisse(jahr: number, mannschaft: DsbMannschaftDO, allMannschaften: DsbMannschaftDO[], veranstaltung: VeranstaltungDO,
                          matches: Array<MatchDO>, passen: Array<PasseDoClass>): WettkampfErgebnis[] {
    this.matches = matches;
    this.passen = passen;
    this.currentMannschaft = mannschaft;
    this.veranstaltung = veranstaltung;
    this.mannschaften = allMannschaften;
    this.sportjahr = jahr;
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
    return this.wettkampErgebnisse;
  }
}
