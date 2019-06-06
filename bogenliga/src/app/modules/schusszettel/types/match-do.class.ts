import {DataObject} from '@shared/data-provider';
import {PasseDO} from './passe-do.class';

export class MatchDO implements DataObject {
  id: number;

  mannschaftId: number;
  mannschaftName: string;
  wettkampfId: number;
  nr: number;
  begegnung: number;
  scheibenNummer: number;
  wettkampfTyp: string;
  sumSatz: Array<number>;

  matchpunkte: number;
  satzpunkte: number;
  fehlerpunkte: Array<number>;

  schuetzen: Array<Array<PasseDO>>;

  constructor(id?: number,
              mannschaftId?: number,
              mannschaftName?: string,
              wettkampfId?: number,
              matchNr?: number,
              begegnung?: number,
              scheibennummer?: number,
              sumSatz?: Array<number>,
              matchpunkte?: number,
              satzpunkte?: number,
              fehlerpunkte?: Array<number>,
              schuetzen?: Array<Array<PasseDO>>,
              wettkampfTyp?: string) {
    this.id = !!id ? id : null;
    this.mannschaftId = !!mannschaftId ? mannschaftId : null;
    this.mannschaftName = !!mannschaftName ? mannschaftName : 'Mannschaft 1';
    this.wettkampfId = !!wettkampfId ? wettkampfId : null;
    this.nr = matchNr;
    this.begegnung = begegnung;
    this.scheibenNummer = !!scheibennummer ? scheibennummer : null;
    this.sumSatz = sumSatz.length > 0 && sumSatz.length <= 5 ? sumSatz : [0, 0, 0, 0, 0];
    this.matchpunkte = matchpunkte;
    this.satzpunkte = satzpunkte;
    this.fehlerpunkte = !!fehlerpunkte ? fehlerpunkte : [0, 0, 0, 0, 0];
    this.schuetzen = !!schuetzen ? schuetzen : [];
    this.wettkampfTyp = wettkampfTyp;
  }
}

