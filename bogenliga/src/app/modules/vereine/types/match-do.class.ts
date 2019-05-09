import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class MatchDO implements VersionedDataObject {

  nr: number;
  id: number;
  wettkampfId: number;
  mannschaftId: number;
  begegnung: number;
  scheibenNummer: number;
  matchpunkte: number;
  satzpunkte: number;
  version: number;
}


