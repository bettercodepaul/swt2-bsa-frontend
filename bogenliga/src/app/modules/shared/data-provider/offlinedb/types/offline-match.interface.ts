
export interface OfflineMatch {
  id?: number; // Primary Key autoincrement
  offlineVersion?: number;

  matchVersion: number; // backend dataset version
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
}
