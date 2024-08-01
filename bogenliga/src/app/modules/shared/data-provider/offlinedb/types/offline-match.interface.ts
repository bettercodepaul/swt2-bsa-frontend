
export interface OfflineMatch {
  offlineVersion?: number;
// backend data below
  matchId: number;
  matchVersion: number;
  wettkampfId: number;
  matchNr: number;
  matchScheibennummer: number;
  matchpkt: number;
  satzpunkte: number;
  mannschaftId: number;
  mannschaftName: string;
  mannschaftNameGegner: string;
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
