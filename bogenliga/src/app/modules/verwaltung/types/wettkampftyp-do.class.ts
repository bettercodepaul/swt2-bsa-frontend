import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';


export class WettkampftypDO implements VersionedDataObject {
  id: number;
  version: number;

  wettkampftypName: string;
}
