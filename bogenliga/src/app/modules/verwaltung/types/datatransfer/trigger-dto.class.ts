import {DataTransferObject} from '@shared/data-provider';

export class TriggerDTO implements DataTransferObject {

  id: number;
  version: number;
  timestamp: string;
  description: string;
  status: string;
  static copyFrom(optional: {
    id?: number;
    version?: number;
    timestamp?: number,
    description?: string,
    status?: number,
  } = {}): TriggerDTO {
    const copy = new TriggerDTO();
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }
    copy.version = optional.version || null;
    copy.timestamp = String(optional.timestamp || null);
    copy.description = optional.description || '';
    copy.status = String(optional.status || null);
    return copy;
  }
}
