import {DataTransferObject} from '@shared/data-provider';

export class VereinDTO implements DataTransferObject {

  id: number;
  version: number;
  name: string;

  identifier: string;
  regionId: number;
  regionName: string;

  static copyFrom(optional: {
    id?: number,
    name?: string,
    identifier?: string,
    regionId?: number,
    regionName?: string,
    version?: number
  } = {}): VereinDTO {
    const copy = new VereinDTO();
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }

    if (optional.regionId >= 0) {
      copy.regionId = optional.regionId;
    } else {
      copy.regionId = null;
    }

    copy.name = optional.name || '';
    copy.identifier = optional.identifier || '';
    copy.regionName = optional.regionName || '';

    copy.version = optional.version || null;

    return copy;
  }
}
