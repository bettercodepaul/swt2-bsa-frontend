import {DataTransferObject} from '@shared/data-provider';

export class WettkampftypDTO implements DataTransferObject {
  id: number;
  wettkampftypName: string;
  version: number;

  static copyFrom(optional: {
    wettkampftypId?: number,
    wettkampftypName?: string,
    version?: number
  } = {}): WettkampftypDTO {
    const copy = new WettkampftypDTO();

    // show '0' value
    if (optional.wettkampftypId >= 0) {
      copy.id = optional.wettkampftypId;
    } else {
      copy.id = null;
    }

    copy.wettkampftypName = optional.wettkampftypName || '';

    copy.version = optional.version || null;

    return copy;
  }
}
