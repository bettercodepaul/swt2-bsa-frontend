import {VersionedDataTransferObject} from '@shared/data-provider';
import {PasseDTO} from './passe-dto.class';

export class MatchDTO implements VersionedDataTransferObject {
  id: number;
  version: number;

  mannschaftId: number;
  mannschaftName: string;
  wettkampfId: number;
  nr: number;
  begegnung: number;
  scheibenNummer: number;

  matchpunkte: number;
  satzpunkte: number;

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
    passen?: Array<PasseDTO>) {
    this.id = !!id ? id : null;
    this.mannschaftId = !!mannschaftId ? mannschaftId : null;
    this.mannschaftName = !!mannschaftName ? mannschaftName : 'Mannschaft 1';
    this.wettkampfId = !!wettkampfId ? wettkampfId : null;
    this.nr = !!matchNr ? matchNr : null;
    this.begegnung = !!begegnung ? begegnung : null;
    this.scheibenNummer = !!scheibennummer ? scheibennummer : null;
    this.matchpunkte = !!matchpunkte ? matchpunkte : null;
    this.satzpunkte = !!satzpunkte ? satzpunkte : null;
    this.passen = !!passen ? passen : [];
  }
}
