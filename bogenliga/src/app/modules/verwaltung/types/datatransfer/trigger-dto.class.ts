import {DataTransferObject} from '@shared/data-provider';

export class TriggerDTO implements DataTransferObject {

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
  static copyFrom(optional: {
    id?: number;
    version?: number;
    kategorie?: string;
    altsystemId?: number;
    operation?: string;
    status?: string;
    nachricht?: string;
    createdAtUtc?: string;
    runAtUtc?: string;
    lastModifiedAtUtc?: string;
  } = {}): TriggerDTO {
    const copy = new TriggerDTO();
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }
    copy.version = optional.version || null;
    copy.kategorie = String(optional.kategorie || null);
    copy.altsystemId = optional.altsystemId || null;
    copy.operation = optional.operation || '';
    copy.nachricht = optional.nachricht || '';
    copy.status = optional.status || '';
    copy.createdAtUtc = optional.createdAtUtc || '';
    copy.runAtUtc = optional.runAtUtc || '';
    copy.lastModifiedAtUtc = optional.lastModifiedAtUtc || '';
    return copy;
  }
}
