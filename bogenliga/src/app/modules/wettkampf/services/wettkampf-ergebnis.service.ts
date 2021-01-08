import {WettkampfErgebnis} from '@wettkampf/components/wettkampf/wettkampergebnis/WettkampfErgebnis';
import {VereinDO} from '@verwaltung/types/verein-do.class';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';
import {MatchDO} from '@verwaltung/types/match-do.class';
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';
import {PasseDoClass} from '@verwaltung/types/passe-do-class';
import {Injectable} from '@angular/core';
import {WettkampfEinzelErgebnis} from '@wettkampf/components/wettkampf/wettkampergebnis/WettkampfEinzelErgebnis';
import {WettkampfEinzelGesamtErgebnis} from '@wettkampf/components/wettkampf/wettkampergebnis/WettkampfEinzelGesamtErgebnis';
import {DsbMitgliedDO} from '@verwaltung/types/dsb-mitglied-do.class';

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
  public wettkampfEinzelErgebnisse: WettkampfEinzelErgebnis[] = [];
  public wettkampfGesamtErgebnisse: WettkampfEinzelGesamtErgebnis[] = [];


  // toLoad
  public mannschaften: Array<DsbMannschaftDO> = [];
  public currentMannschaft: DsbMannschaftDO;
  public matches: Array<MatchDO> = [];
  private passen: Array<PasseDoClass> = [];
  private schuetze: Array<PasseDoClass> = [];
  public mitglieder: Array<DsbMitgliedDO>;

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

  /**
   * Initializes class variables with given values and starts @createWettkampfergebnisse
   * @param jahr
   * @param mannschaft
   * @param allMannschaften
   * @param veranstaltung
   * @param matches
   * @param passen
   */
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




  /**
   * If this.currentMannschaft != undefined this method is used to select only match encounters where currentMannschaft
   * participated. Returns the new match Array<MatchDO>.
   * @todo Should be possible to load match encounters via sql from table. If thats possible this method is not needed.
   */
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

  /**
   * Creates all new wettkampfErgebnisse and returns the WettkampfErgebnis[] from the selected wettkampf.
   */
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


  /*
  createEinzelErgebnisse()
  Initialisiert alle Variablen welche für createWettkampfEinzelergebnisse benötigt werden
  und gibt die Funktion creatWettkampfEinzelergebniss zurück, bzw startet diese.
  Die uebergebenen Passe werden anhand der aktuellen Mannschaft gefiltert.
   */
  public createEinzelErgebnisse(mitglieder: Array<DsbMitgliedDO>, jahr: number, mannschaft: DsbMannschaftDO, passen: Array<PasseDoClass>): WettkampfEinzelErgebnis[] {
    this.passen = passen;
    this.mitglieder = mitglieder;
    this.currentMannschaft = mannschaft;
    if (this.currentMannschaft !== undefined) {
      this.passen = this.filterPassen();
    }
    this.schuetze = this.passen.filter((thing, index, self) =>
      index === self.findIndex((t) => (t.matchNr === thing.matchNr && t.dsbMitgliedId === thing.dsbMitgliedId)));
    return this.createWettkampfEinzelergebnisse();
  }

  /*
  createWettkampfEinzelergebnisse()
  Erstellt alle Wettkampfergebnisse in "wettkampfEinzelErgebnis", welches die benoetigten Werte übergeben bekommt,
  für die einzelnen Schuetzen.
  Diese werden in den Array wettkampfEinzelErgebnisse gepusht und dieser wird am Ende zurückgegeben.
   */
  public createWettkampfEinzelergebnisse(): WettkampfEinzelErgebnis[] {
    this.wettkampfEinzelErgebnisse = [];
    for (const schuetze of this.schuetze) {
      const wettkampfEinzelErgebnis = new WettkampfEinzelErgebnis(schuetze.matchNr, schuetze.wettkampfId,
        this.getMannschaftsname(schuetze.mannschaftId), this.getMitgliederName(schuetze.dsbMitgliedId), this.getPfeilwertProMatch(schuetze.matchNr, schuetze.dsbMitgliedId));
      this.wettkampfEinzelErgebnisse.push(wettkampfEinzelErgebnis);
    }
    return this.wettkampfEinzelErgebnisse;
  }


  /*
   getMitgliederName()
   Mit hilfe der dsbMitgliedID wird in dem Array Mitglieder, welche die dsbMitglieder aus der Datenbank enthält,
   nach dem zugehörigen Namen gesucht und daraufhin zusammen mit der ID zurückgegeben.
   */
  public getMitgliederName(dsbMitgliedId: number): string {
    let mitgliederName = '';
    const name = this.mitglieder.find((mitglied) => {
      return mitglied.id === dsbMitgliedId;
    });
    if (name !== undefined) {
      mitgliederName += dsbMitgliedId + ', ' + name.vorname + ' ' + name.nachname;
    } else {
      mitgliederName += dsbMitgliedId;
    }
    return mitgliederName;
  }

  /*
  getPfeilwertProMatch()
  Es werden MatchNummer und die dsbMitgliederID übergeben und daraufhin die Pfeilwerte des dsbMitglieds
  in einem Match zusammen gerechnet und der Durchschnitt ermittelt.
   */
  public getPfeilwertProMatch(matchNr: number, dsbMitgliedId: number): number {
    let pfeilwertSummeMatch = 0;
    let count = 0;
    const filteredPasse: Array<PasseDoClass> = this.passen.filter((passe) => {
      return passe.matchNr === matchNr && passe.dsbMitgliedId === dsbMitgliedId;
    });
    for (const passe of filteredPasse) {
      for (const ringzahl of passe.ringzahl) {
        if (ringzahl !== null) {
          count++;
          pfeilwertSummeMatch += ringzahl;
        }
      }
    }
    if (count !== 0) {
      pfeilwertSummeMatch = pfeilwertSummeMatch / count;
    }
    return pfeilwertSummeMatch;
  }

  /*
  filterPassen()
  Filtert alle Passe nach der aktuellen Mannschaft und gibt diese als Array zurück
   */
  public filterPassen(): Array<PasseDoClass> {
    const passeMatches: Array<PasseDoClass> = [];
    for (const passe of this.passen) {
      if (this.currentMannschaft.id === passe.mannschaftId) {
        passeMatches.push(passe);
      }
    }
    return passeMatches;
  }

  /*
   createGesamtErgebnisse()
   Initialisiert alle Variablen welche für createWettkampfGesamtergebnisse benötigt werden
   und gibt die Funktion creatWettkampfGesamtergebniss zurück, bzw startet diese.
   Die uebergebenen Passe und Matches werden anhand der aktuellen Mannschaft gefiltert und daraufhin die Schuetzen herausgefiltert.
   */
  public createGesamtErgebnisse(mitglieder: Array<DsbMitgliedDO>, jahr: number, matches: Array<MatchDO>, mannschaft: DsbMannschaftDO, passen: Array<PasseDoClass>): WettkampfEinzelGesamtErgebnis[] {
    this.passen = passen;
    this.mitglieder = mitglieder;
    this.currentMannschaft = mannschaft;
    this.matches = matches;
    if (this.currentMannschaft !== undefined) {
      this.passen = this.filterPassen();
      this.matches = this.filterMannschaft();
    }
    this.schuetze = this.passen.filter((thing, index, self) =>
      index === self.findIndex((t) => (t.dsbMitgliedId === thing.dsbMitgliedId)));
    return this.createWettkampfGesamtergebnisse();
  }

  /*
   createWettkampfGesamtergebnisse()
   Erstellt alle Wettkampfergebnisse in "wettkampfEinzelGesamtErgebnis", welches die benoetigten Werte übergeben bekommt,
   für die einzelnen Schuetzen.
   Diese werden in den Array wettkampfGesamtErgebnisse gepusht und dieser wird am Ende zurückgegeben.
   */
  public createWettkampfGesamtergebnisse(): WettkampfEinzelGesamtErgebnis[] {
    this.wettkampfGesamtErgebnisse = [];
    for (const schuetze of this.schuetze) {
      const wettkampfGesamtErgebnis = new WettkampfEinzelGesamtErgebnis(schuetze.wettkampfId,
        this.getMannschaftsname(schuetze.mannschaftId), this.getMitgliederName(schuetze.dsbMitgliedId), this.getPfeilwertProJahr(schuetze.dsbMitgliedId));
      this.wettkampfGesamtErgebnisse.push(wettkampfGesamtErgebnis);
    }
    return this.wettkampfGesamtErgebnisse;
  }

  /*
  getPfeilwertProJahr()
  Es werden alle durchschnittswerte eines Matches mithilfe der getPfeilwertProMatch funktion ermittelt
  und daraufhin für das gesamte jahr ausgerechnet.
   */
  public getPfeilwertProJahr(dsbMitgliedId: number): number {
    let pfeilwertSumme = 0;
    let count = 0;
    for (const match of this.matches) {
      pfeilwertSumme += this.getPfeilwertProMatch(match.nr, dsbMitgliedId);
      count++;
    }
    if (count !== 0) {
      pfeilwertSumme = pfeilwertSumme / count;
    }
    return pfeilwertSumme;
}


}

