import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';

export  class PasseDoClass implements VersionedDataObject {
  id: number;
  version: number;

  matchId: number;
  mannschaftId: number;
  wettkampfId: number;
  matchNr: number;
  lfdNr: number;
  dsbMitgliedId: number;

  ringzahl: Array<number>;
  schuetzeNr: number;
}
