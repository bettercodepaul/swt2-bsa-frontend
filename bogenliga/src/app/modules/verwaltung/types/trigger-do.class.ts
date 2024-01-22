import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class TriggerDO implements VersionedDataObject {
  id: number;
  version: number;

  kategorie: string;
  altsystem_id: number;
  operation: string;
  status: string;
  nachricht: string;
  created_at_utc: string;
  run_at_utc: string;
}
