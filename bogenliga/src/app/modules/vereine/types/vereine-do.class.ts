import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class VereineDO implements VersionedDataObject {
  id: number;
  version: number;

  name: string;
  identifier: string;
  regionId: number;
  regionName: string;
}
