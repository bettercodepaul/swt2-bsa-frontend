import {DataTransferObject} from '../../../shared/data-provider';

export class DsbMannschaftDTO implements DataTransferObject {
  id: number;
  nummer: string;
  vereinId: number;
  userId: number;
  version: number;

  static copyFrom(optional: {
    id?: number,
    nummer?: string,
    vereinId?: number,
    userId?: number,
    version?: number
  } = {}): DsbMannschaftDTO {
    const copy = new DsbMannschaftDTO();
    // show '0' value
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }
    copy.userId = optional.userId || null;
    copy.version = optional.version || null;
    copy.vereinId = optional.vereinId || null;
    copy.nummer = optional.nummer || '';

    return copy;
  }
}
