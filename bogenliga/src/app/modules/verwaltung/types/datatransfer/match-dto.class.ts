import {DataTransferObject} from '../../../shared/data-provider';

export class MatchDTO implements DataTransferObject {

  nr: number;
  id: number;
  version: number;
  wettkampfId: number;
  wettkampfTypId: number;
  mannschaftId: number;
  begegnung: number;
  scheibenNummer: number;
  matchpunkte: number;
  satzpunkte: number;

// die Funktion copyFrom wird benutzt um die Daten der Schnittstelle aus dem Backend auszulesen.
// dabei müssen die Variablem von optional so benannt sein, dass sie exakten den Namen des DTO im Backende entsprechen.
  static copyFrom(optional: {
    matchNr?: number,
    id?: number,
    wettkampfId?: number,
    wettkampfTypId?: number,
    mannschaftId?: number,
    begegnung?: number,
    matchScheibennummer?: number,
    matchpunkte?: number,
    satzpunkte?: number,
    version?: number

  } = {}): MatchDTO {
    const copy = new MatchDTO();
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }

    if (optional.matchNr >= 0) {
      copy.nr = optional.matchNr;
    } else {
      copy.nr = null;
    }

    if (optional.wettkampfId >= 0) {
      copy.wettkampfId = optional.wettkampfId;
    } else {
      copy.wettkampfId = null;
    }

    if (optional.wettkampfTypId >= 0) {
      copy.wettkampfTypId = optional.wettkampfTypId;
    } else {
      copy.wettkampfTypId = null;
    }

    if (optional.mannschaftId >= 0) {
      copy.mannschaftId = optional.mannschaftId;
    } else {
      copy.mannschaftId = null;
    }

    if (optional.begegnung >= 0) {
      copy.begegnung = optional.begegnung;
    } else {
      copy.begegnung = null;
    }

    if (optional.matchScheibennummer >= 0) {
      copy.scheibenNummer = optional.matchScheibennummer;
    } else {
      copy.scheibenNummer = null;
    }

    if (optional.matchpunkte >= 0) {
      copy.matchpunkte = optional.matchpunkte;
    } else {
      copy.matchpunkte = null;
    }

    if (optional.satzpunkte >= 0) {
      copy.satzpunkte = optional.satzpunkte;
    } else {
      copy.satzpunkte = null;
    }

    copy.version = optional.version || null;

    return copy;
  }
}
