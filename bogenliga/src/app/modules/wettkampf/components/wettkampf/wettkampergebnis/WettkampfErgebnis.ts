import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';

export class WettkampfErgebnis implements VersionedDataObject {
  id: number;
  version: number;

  matchNr: number;
  wettkampfId: number;
  mannschaftName: string;
  mannschaftSatz1: number;
  mannschaftSatz2: number;
  mannschaftSatz3: number;
  mannschaftSatz4: number;
  mannschaftSatz5: number;
  opponentName: string;
  opponentSatz1: number;
  opponentSatz2: number;
  opponentSatz3: number;
  opponentSatz4: number;
  opponentSatz5: number;
  satzpunkte: string;
  matchpunkte: string;

  constructor(matchNr?: number,
              wettkampfId?: number,
              mannschaftName?: string,
              mannschaftSatz1?: number,
              mannschaftSatz2?: number,
              mannschaftSatz3?: number,
              mannschaftSatz4?: number,
              mannschaftSatz5?: number,
              opponentName?: string,
              opponentSatz1?: number,
              opponentSatz2?: number,
              opponentSatz3?: number,
              opponentSatz4?: number,
              opponentSatz5?: number,
              satzpunkte?: string,
              matchpunkte?: string) {
    this.matchNr = matchNr;
    this.wettkampfId = wettkampfId;
    this.mannschaftName = mannschaftName;
    this.mannschaftSatz1 = mannschaftSatz1;
    this.mannschaftSatz2 = mannschaftSatz2;
    this.mannschaftSatz3 = mannschaftSatz3;
    this.mannschaftSatz4 = mannschaftSatz4;
    this.mannschaftSatz5 = mannschaftSatz5;
    this.opponentName = opponentName;
    this.opponentSatz1 = opponentSatz1;
    this.opponentSatz2 = opponentSatz2;
    this.opponentSatz3 = opponentSatz3;
    this.opponentSatz4 = opponentSatz4;
    this.opponentSatz5 = opponentSatz5;
    this.satzpunkte = satzpunkte;
    this.matchpunkte = matchpunkte;


  }
}
