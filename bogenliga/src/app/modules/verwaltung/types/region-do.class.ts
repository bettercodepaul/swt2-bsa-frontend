import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class RegionDO implements VersionedDataObject {
  id: number;
  version: number;

  regionName: string;
  regionKuerzel: string;
  regionTyp: string;
  regionUebergeordnet: number;

  regionUebergeordnetAsName: string;
}
