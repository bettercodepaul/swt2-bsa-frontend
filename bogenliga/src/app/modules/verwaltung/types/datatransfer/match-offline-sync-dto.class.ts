import {DataTransferObject} from '../../../shared/data-provider';

export class MatchOfflineSyncDto implements DataTransferObject {

  id: number;
  version: number;
  matchVersion: number;
  wettkampfId: number;
  matchNr: number;
  matchScheibennummer: number;
  matchpkt: number;
  satzpunkte: number;
  mannschaftId: number;
  mannschaftName: string;
  nameGegner: string;
  scheibennummerGegner: number;
  matchIdGegner: number;
  naechsteMatchId: number;
  naechsteNaechsteMatchNrMatchId: number;
  strafpunkteSatz1: number;
  strafpunkteSatz2: number;
  strafpunkteSatz3: number;
  strafpunkteSatz4: number;
  strafpunkteSatz5: number;


  static copyFrom(optional: {
    id?: number;
    version?: number;
    matchVersion?: number,
    wettkampfId?: number,
    matchNr?: number,
    matchScheibennummer?: number,
    matchpkt?: number,
    satzpunkte?: number;
    mannschaftId?: number,
    mannschaftName?: string,
    nameGegner?: string,
    scheibennummerGegner?: number,
    matchIdGegner?: number,
    naechsteMatchId?: number,
    naechsteNaechsteMatchNrMatchId?: number,
    strafpunkteSatz1?: number,
    strafpunkteSatz2?: number,
    strafpunkteSatz3?: number,
    strafpunkteSatz4?: number,
    strafpunkteSatz5?: number,

  } = {}): MatchOfflineSyncDto {
    const copy = new MatchOfflineSyncDto();
    // Offline interface data -> Looked at the db and saw that everything can be null
    // IDK why the normal match mapper has not the same data
    copy.id = optional.id || null;
    copy.version = optional.version || null;
    copy.wettkampfId = optional.wettkampfId >= 0 ? optional.wettkampfId : null;
    copy.matchNr = optional.matchNr >= 0 ? optional.matchNr : null;
    copy.matchScheibennummer = optional.matchScheibennummer >= 0 ? optional.matchScheibennummer : null;
    copy.matchpkt = optional.matchpkt >= 0 ? optional.matchpkt : null;
    copy.satzpunkte = optional.satzpunkte >= 0 ? optional.satzpunkte : null;
    copy.mannschaftId = optional.mannschaftId >= 0 ? optional.mannschaftId : null;
    copy.mannschaftName = optional.mannschaftName || null;
    copy.nameGegner = optional.nameGegner || null;
    copy.scheibennummerGegner = optional.scheibennummerGegner >= 0 ? optional.scheibennummerGegner : null;
    copy.matchIdGegner = optional.matchIdGegner >= 0 ? optional.matchIdGegner : null;
    copy.naechsteMatchId = optional.naechsteMatchId >= 0 ? optional.naechsteMatchId : null;
    copy.naechsteNaechsteMatchNrMatchId = optional.naechsteNaechsteMatchNrMatchId >= 0 ? optional.naechsteNaechsteMatchNrMatchId : null;
    copy.strafpunkteSatz1 = optional.strafpunkteSatz1 >= 0 ? optional.strafpunkteSatz1 : null;
    copy.strafpunkteSatz2 = optional.strafpunkteSatz2 >= 0 ? optional.strafpunkteSatz2 : null;
    copy.strafpunkteSatz3 = optional.strafpunkteSatz3 >= 0 ? optional.strafpunkteSatz3 : null;
    copy.strafpunkteSatz4 = optional.strafpunkteSatz4 >= 0 ? optional.strafpunkteSatz4 : null;
    copy.strafpunkteSatz5 = optional.strafpunkteSatz5 >= 0 ? optional.strafpunkteSatz5 : null;


    return copy;
  }
}
