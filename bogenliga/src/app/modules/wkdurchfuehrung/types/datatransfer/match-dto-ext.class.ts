import {DataTransferObject} from '../../../shared/data-provider';
import {PasseDTO} from './passe-dto.class';
import {isNullOrUndefined} from '@shared/functions';

export class MatchDTOExt implements DataTransferObject {

  id: number;
  version: number;
  mannschaftId: number;
  mannschaftName: string;
  wettkampfId: number;
  wettkampfTag: number;
  wettkampfTyp: string;
  nr: number;
  begegnung: number;
  scheibenNummer: number;
  matchpunkte: number;
  satzpunkte: number;
  strafPunkteSatz1: number;
  strafPunkteSatz2: number;
  strafPunkteSatz3: number;
  strafPunkteSatz4: number;
  strafPunkteSatz5: number;
  passen: PasseDTO[];

  constructor(id?: number,
              mannschaftId?: number,
              mannschaftName?: string,
              wettkampfId?: number,
              matchNr?: number,
              begegnung?: number,
              scheibennummer?: number,
              matchpunkte?: number,
              satzpunkte?: number,
              strafPunkteSatz1?: number,
              strafPunkteSatz2?: number,
              strafPunkteSatz3?: number,
              strafPunkteSatz4?: number,
              strafPunkteSatz5?: number,
              passen?: Array<PasseDTO>,
              wettkampfTag?: number,
              wettkampfTyp?: string) {
    this.id = !!id ? id : null;
    this.mannschaftId = !!mannschaftId ? mannschaftId : null;
    this.mannschaftName = !!mannschaftName ? mannschaftName : 'Mannschaft 1';
    this.wettkampfId = !!wettkampfId ? wettkampfId : null;
    this.nr = !!matchNr ? matchNr : null;
    this.begegnung = !!begegnung ? begegnung : null;
    this.scheibenNummer = !!scheibennummer ? scheibennummer : null;
    this.matchpunkte = matchpunkte;
    this.satzpunkte = satzpunkte;
    this.strafPunkteSatz1 = !!strafPunkteSatz1 ? strafPunkteSatz1 : 0;
    this.strafPunkteSatz2 = !!strafPunkteSatz2 ? strafPunkteSatz2 : 0;
    this.strafPunkteSatz3 = !!strafPunkteSatz3 ? strafPunkteSatz3 : 0;
    this.strafPunkteSatz4 = !!strafPunkteSatz4 ? strafPunkteSatz4 : 0;
    this.strafPunkteSatz5 = !!strafPunkteSatz5 ? strafPunkteSatz5 : 0;
    this.passen = !!passen ? passen : [];
    this.wettkampfTyp = wettkampfTyp;
    this.wettkampfTag = wettkampfTag;
  }


  static copyFrom(optional: {
    id?: number,
    version?: number,
    mannschaftId?: number,
    mannschaftName?: string,
    wettkampfId?: number,
    wettkampfTag?: number,
    wettkampfTyp?: string,
    nr?: number,
    begegnung?: number,
    scheibenNummer?: number,
    matchpunkte?: number,
    satzpunkte?: number,
    strafPunkteSatz1?: number,
    strafPunkteSatz2?: number,
    strafPunkteSatz3?: number,
    strafPunkteSatz4?: number,
    strafPunkteSatz5?: number,
    passen?: PasseDTO[];

  } = {}): MatchDTOExt {
    const copy = new MatchDTOExt();

    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }
    if (optional.version >= 0) {
      copy.version = optional.version;
    } else {
      copy.version = null;
    }
    if (optional.mannschaftId >= 0) {
      copy.mannschaftId = optional.mannschaftId;
    } else {
      copy.mannschaftId = null;
    }
    copy.mannschaftName = optional.mannschaftName || '';

    if (optional.wettkampfId >= 0) {
      copy.wettkampfId = optional.wettkampfId;
    } else {
      copy.wettkampfId = null;
    }

    if (optional.wettkampfTag >= 0) {
      copy.wettkampfTag = optional.wettkampfTag;
    } else {
      copy.wettkampfTag = null;
    }
    copy.wettkampfTyp = optional.wettkampfTyp || '';

    if (optional.nr >= 0) {
      copy.nr = optional.nr;
    } else {
      copy.nr = null;
    }
    if (optional.begegnung >= 0) {
      copy.begegnung = optional.begegnung;
    } else {
      copy.begegnung = null;
    }
    if (optional.scheibenNummer >= 0) {
      copy.scheibenNummer = optional.scheibenNummer;
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
    if (optional.strafPunkteSatz1 >= 0) {
      copy.strafPunkteSatz1 = optional.strafPunkteSatz1;
    } else {
      copy.strafPunkteSatz1 = null;
    }
    if (optional.strafPunkteSatz2 >= 0) {
      copy.strafPunkteSatz2 = optional.strafPunkteSatz2;
    } else {
      copy.strafPunkteSatz2 = null;
    }
    if (optional.strafPunkteSatz3 >= 0) {
      copy.strafPunkteSatz3 = optional.strafPunkteSatz3;
    } else {
      copy.strafPunkteSatz3 = null;
    }
    if (optional.strafPunkteSatz4 >= 0) {
      copy.strafPunkteSatz4 = optional.strafPunkteSatz4;
    } else {
      copy.strafPunkteSatz4 = null;
    }
    if (optional.strafPunkteSatz5 >= 0) {
      copy.strafPunkteSatz5 = optional.strafPunkteSatz5;
    } else {
      copy.strafPunkteSatz5 = null;
    }

    if (isNullOrUndefined(optional.passen)) {
      copy.passen = null;
    } else {
      copy.passen = new Array();
      optional.passen.forEach((passe) => {
        copy.passen.push(passe);
      });
    }

    return copy;
  }



}
