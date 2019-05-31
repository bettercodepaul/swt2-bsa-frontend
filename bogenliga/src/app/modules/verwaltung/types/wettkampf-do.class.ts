import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';


export class WettkampfDO implements VersionedDataObject {
  id: number;
  version: number;

  wettkampfDatum: string;
  wettkampfOrt: string;
  wettkampfBeginn: string;
  wettkampfTag: number;
  wettkampfVeranstaltungsId: number;

  //not set, find Liga by Wettkampfid
  wettkampfLiga: string;
}
