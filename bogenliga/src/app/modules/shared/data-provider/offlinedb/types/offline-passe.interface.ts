
export interface OfflinePasse {
  // passe_id
  id?: number;
  version?: number;
  matchId: number;
  mannschaftId: number;
  wettkampfId: number;
  matchNr: number;
  lfdNr: number;
  dsbMitgliedId: number;
  ringzahlPfeil1: number;
  ringzahlPfeil2: number;
  ringzahlPfeil3: number;
  ringzahlPfeil4: number;
  ringzahlPfeil5: number;
  ringzahlPfeil6: number;
  // ich weiß nicht wo dieses feld steht oder wo es generiert wird, in der DB ist das column nicht vorhanden
   rueckennummer: number;
}
