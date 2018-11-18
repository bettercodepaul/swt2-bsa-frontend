import {DataTransferObject} from '../../../shared/data-provider';

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
    copy.id = optional.id || null;
    copy.name = optional.name || '';
    copy.identifier = optional.identifier || '';
    copy.regionId = optional.regionId || null;
    copy.regionName = optional.regionName || '';

    copy.version = optional.version || null;

    return copy;
  }
}
