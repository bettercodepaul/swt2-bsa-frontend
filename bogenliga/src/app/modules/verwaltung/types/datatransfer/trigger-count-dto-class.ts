import {DataTransferObject} from '@shared/data-provider';

export class TriggerCountDTO implements DataTransferObject{
  count: number;

  static copyFrom(optional: {
    count?: number;
  } = {}): TriggerCountDTO {
    const copy = new TriggerCountDTO();
    copy.count = optional.count || null;
    return copy;
  }
}
