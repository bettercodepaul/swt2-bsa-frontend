import {DataObject} from '../../shared/data-provider';
import {PasseDO} from './passe-do.class';

export class MatchDOExt implements DataObject {
  id: number;
  version: number;
  mannschaftId: number;
  mannschaftName: string;
  wettkampfId: number;
  nr: number;
  begegnung: number;
  matchScheibennummer: number;
  wettkampfTag: number;
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
              matchScheibennummer?: number,
              sumSatz?: Array<number>,
              matchpunkte?: number,
              satzpunkte?: number,
              fehlerpunkte?: Array<number>,
              schuetzen?: Array<Array<PasseDO>>,
              wettkampfTag?: number,
              wettkampfTyp?: string) {
    this.id = !!id ? id : null;
    this.mannschaftId = !!mannschaftId ? mannschaftId : null;
    this.mannschaftName = !!mannschaftName ? mannschaftName : 'Mannschaft 1';
    this.wettkampfId = !!wettkampfId ? wettkampfId : null;
    this.nr = matchNr;
    this.begegnung = begegnung;
    this.matchScheibennummer = !!matchScheibennummer ? matchScheibennummer : null;
    this.sumSatz = !!sumSatz ? sumSatz : [5];
    this.matchpunkte = matchpunkte;
    this.satzpunkte = satzpunkte;
    this.fehlerpunkte = !!fehlerpunkte ? fehlerpunkte : [];
    this.schuetzen = !!schuetzen ? schuetzen : [];
    this.wettkampfTyp = wettkampfTyp;
    this.wettkampfTag = wettkampfTag;
  }
}
