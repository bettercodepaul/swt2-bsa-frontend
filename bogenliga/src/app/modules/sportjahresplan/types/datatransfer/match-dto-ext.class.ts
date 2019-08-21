import {VersionedDataTransferObject} from '../../../shared/data-provider';
import {PasseDTO} from './passe-dto.class';

export class MatchDTOExt implements VersionedDataTransferObject {
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

  passen: Array<PasseDTO>;

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
}
