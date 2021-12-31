import {DataTransferObject} from '@shared/data-provider';

export class LigasyncmatchDtoClass implements DataTransferObject {
  id: number;
  version: number;
  wettkampfId: number;
  matchNr: number;
  matchScheibennummer: number;
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
    id?: number,
    version?: number,
    wettkampfId?: number,
    matchNr?: number,
    matchScheibennummer?: number,
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
    strafpunkteSatz5?: number
  } = {}): LigasyncmatchDtoClass {
    const copy = new LigasyncmatchDtoClass();
    copy.id = optional.id || null;
    copy.version = optional.version || null;
    copy.wettkampfId = optional.wettkampfId || null;
    copy.matchNr = optional.matchNr || null;
    copy.matchScheibennummer = optional.matchScheibennummer || null;
    copy.mannschaftId = optional.mannschaftId || null;
    copy.mannschaftName = optional.mannschaftName || null;
    copy.nameGegner = optional.nameGegner || null;
    copy.scheibennummerGegner = optional.scheibennummerGegner || null;
    copy.matchIdGegner = optional.matchIdGegner || null;
    copy.naechsteMatchId = optional.naechsteMatchId || null;
    copy.naechsteNaechsteMatchNrMatchId = optional.naechsteNaechsteMatchNrMatchId || null;
    copy.strafpunkteSatz1 = optional.strafpunkteSatz1 || null;
    copy.strafpunkteSatz2 = optional.strafpunkteSatz2 || null;
    copy.strafpunkteSatz3 = optional.strafpunkteSatz3 || null;
    copy.strafpunkteSatz4 = optional.strafpunkteSatz4 || null;
    copy.strafpunkteSatz5 = optional.strafpunkteSatz5 || null;
    return copy;
  }
}
