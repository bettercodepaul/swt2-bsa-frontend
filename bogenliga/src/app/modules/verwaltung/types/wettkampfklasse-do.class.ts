import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';


export class WettkampfKlasseDO implements VersionedDataObject {
  id: number;
  version: number;

  klasseName: string;
  klasseAlterMin: number;
  klasseAlterMax: number;
  klasseNr: number;
}
