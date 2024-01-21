import {DataTransferObject} from '@shared/data-provider';

export class TriggerDTO implements DataTransferObject {

  id: number;
  version: number;

  kategorie: string;
  altsystem_id: number;
  operation: string;
  status: string;
  nachricht: string;
  created_at_utc: string;
  run_at_utc: string;
  static copyFrom(optional: {
    id?: number;
    version?: number;
    kategorie?: string;
    altsystem_id?: number;
    operation?: string;
    status?: string;
    nachricht?: string;
    created_at_utc?: string;
    run_at_utc?: string;
  } = {}): TriggerDTO {
    const copy = new TriggerDTO();
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }
    copy.version = optional.version || null;
    copy.kategorie = String(optional.kategorie || null);
    copy.altsystem_id = optional.altsystem_id || null;
    copy.operation = optional.operation || '';
    copy.nachricht = optional.nachricht || '';
    copy.status = optional.status || '';
    copy.created_at_utc = optional.created_at_utc || '';
    copy.run_at_utc = optional.run_at_utc || '';
    return copy;
  }
}
