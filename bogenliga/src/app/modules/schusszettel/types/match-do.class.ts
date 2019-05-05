import {DataObject} from '@shared/data-provider';
import {PasseDO} from './passe-do.class';

export class MatchDO implements DataObject {
  id: number;

  mannschaftId: number;
  wettkampfId: number;
  matchNr: number;
  begegnung: number;
  scheibennummer: number;

  sumSatz1: number;
  sumSatz2: number;
  sumSatz3: number;
  sumSatz4: number;
  sumSatz5: number;

  matchpunkte: number;
  satzpunkte: number;

  schuetzen: Array<Array<PasseDO>>;

  constructor(id?: number,
    mannschaftId?: number,
    wettkampfId?: number,
    matchNr?: number,
    begegnung?: number,
    scheibennummer?: number,
    matchpunkte?: number,
    satzpunkte?: number,
    schuetzen?: Array<Array<PasseDO>>) {
    this.id = !!id ? id : null;
    this.mannschaftId = !!mannschaftId ? mannschaftId : null;
    this.wettkampfId = !!wettkampfId ? wettkampfId : null;
    this.matchNr = !!matchNr ? matchNr : null;
    this.begegnung = !!begegnung ? begegnung : null;
    this.scheibennummer = !!scheibennummer ? scheibennummer : null;
    this.matchpunkte = !!matchpunkte ? matchpunkte : null;
    this.satzpunkte = !!satzpunkte ? satzpunkte : null;
    this.schuetzen = !!schuetzen ? schuetzen : [];
  }
}

