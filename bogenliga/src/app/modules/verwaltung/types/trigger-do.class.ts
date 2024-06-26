import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class TriggerDO implements VersionedDataObject {
  id: number;
  version: number;
  kategorie: string;
  altsystemId: number;
  operation: string;
  status: string;
  nachricht: string;
  createdAtUtc: string;
  runAtUtc: string;
  lastModifiedAtUtc: string;
}
