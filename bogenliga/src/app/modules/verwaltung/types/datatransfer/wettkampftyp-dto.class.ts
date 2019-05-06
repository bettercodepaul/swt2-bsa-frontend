import {DataTransferObject} from '@shared/data-provider';

export class WettkampftypDTO implements DataTransferObject {
  id: number;
  name: string;
  version: number;

  static copyFrom(optional: {
    id?: number,
    name?: string,
    version?: number
  } = {}): WettkampftypDTO {
    const copy = new WettkampftypDTO();

    // show '0' value
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }

    copy.name = optional.name || '';

    copy.version = optional.version || null;

    return copy;
  }
}
