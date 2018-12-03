import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';


export class WettkampfKlasseDO implements VersionedDataObject {
  id: number;
  version: number;

  klasseName: string;
  klasseJahrgangMin: number;
  klasseJahrgangMax: number;
  klasseNr: number;
}
