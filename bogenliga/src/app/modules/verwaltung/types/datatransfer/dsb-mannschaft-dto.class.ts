import {DataTransferObject} from '../../../shared/data-provider';

export class DsbMannschaftDTO implements DataTransferObject {
  id: number;
  mannschaftsnummer: string;
  vereinsId: number;
  userId: number;
  version: number;

  static copyFrom(optional: {
    id?: number,
    mannschaftsnummer?: string,
    vereinsId?: number,
    userId?: number,
    version?: number
  } = {}): DsbMannschaftDTO {
    const copy = new DsbMannschaftDTO();
    copy.id = optional.id || null;
    copy.vereinsId = optional.vereinsId || null;
    copy.userId = optional.userId || null;
    copy.version = optional.version || null;

    return copy;
  }
}
