import {DataTransferObject} from '@shared/data-provider';

export class TriggerDTO implements DataTransferObject {

  timestamp: string;
  description: string;
  status: string;
  static copyFrom(optional: {
    timestamp?: number,
    description?: string,
    status?: number,
  } = {}): TriggerDTO {
    const copy = new TriggerDTO();
    copy.timestamp = String(optional.timestamp || null);
    copy.description = optional.description || '';
    copy.status = String(optional.status || null);
    return copy;
  }
}
