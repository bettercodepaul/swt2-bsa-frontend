import {DataTransferObject} from '../../../shared/data-provider';

export class MannschaftDTO implements DataTransferObject {
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
  } = {}): MannschaftDTO {
    const copy = new MannschaftDTO();
    copy.id = optional.id || null;
    copy.vereinsId = optional.vereinsId || null;
    copy.userId = optional.userId || null;
    copy.version = optional.version || null;

    return copy;
  }
}
