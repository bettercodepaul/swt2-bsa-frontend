import {VersionedDataTransferObject} from '@shared/data-provider';
import {PasseDTO} from './passe-dto.class';
import {PasseDO} from '../passe-do.class';

export class MatchDTO implements VersionedDataTransferObject {
  id: number;
  version: number;

  mannschaftId: number;
  wettkampfId: number;
  nr: number;
  begegnung: number;
  scheibenNummer: number;

  matchpunkte: number;
  satzpunkte: number;

  passen: Array<PasseDTO>;

  constructor(id?: number,
    mannschaftId?: number,
    wettkampfId?: number,
    matchNr?: number,
    begegnung?: number,
    scheibennummer?: number,
    matchpunkte?: number,
    satzpunkte?: number,
    passen?: Array<PasseDTO>) {
    this.id = !!id ? id : null;
    this.mannschaftId = !!mannschaftId ? mannschaftId : null;
    this.wettkampfId = !!wettkampfId ? wettkampfId : null;
    this.nr = !!matchNr ? matchNr : null;
    this.begegnung = !!begegnung ? begegnung : null;
    this.scheibenNummer = !!scheibennummer ? scheibennummer : null;
    this.matchpunkte = !!matchpunkte ? matchpunkte : null;
    this.satzpunkte = !!satzpunkte ? satzpunkte : null;
    this.passen = !!passen ? passen : [];
  }
}
//
//
// {
//   "begegnung": 0,
//   "id": 0,
//   "mannschaftId": 0,
//   "matchpunkte": 0,
//   "nr": 0,
//   "passen": [
//   {
//     "dsbMitgliedNr": 0,
//     "id": 0,
//     "lfdNr": 0,
//     "mannschaftId": 0,
//     "matchNr": 0,
//     "ringzahl": [
//       0
//     ],
//     "wettkampfId": 0
//   }
// ],
//   "satzpunkte": 0,
//   "scheibenNummer": 0,
//   "version": 0,
//   "wettkampfId": 0
// }
