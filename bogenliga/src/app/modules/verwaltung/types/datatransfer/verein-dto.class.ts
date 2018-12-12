import {DataTransferObject} from '../../../shared/data-provider';

export class VereinDTO implements DataTransferObject {
  id: number;
  version: number;
  name: string;
  identifier: string;
  vereinId: number;
  vereinName: string;
  static copyFrom(optional: {
    id?: number,
    name?: string,
    identifier?: string,
    vereinId?: number,
    vereinName?: string,
    version?: number
  } = {}): VereinDTO {
    const copy = new VereinDTO();
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }

    if (optional.vereinId >= 0) {
      copy.vereinId = optional.vereinId;
    } else {
      copy.vereinId = null;
    }
    copy.name = optional.name || '';
    copy.identifier = optional.identifier || '';
    copy.vereinName = optional.vereinName || '';

    copy.version = optional.version || null;
    return copy;
  }
}
