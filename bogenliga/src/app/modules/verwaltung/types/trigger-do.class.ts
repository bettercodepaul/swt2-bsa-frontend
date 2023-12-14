import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class TriggerDO implements VersionedDataObject {
  id: number;
  version: number;

  timestamp: string;
  description: string;
  status: string;
}
