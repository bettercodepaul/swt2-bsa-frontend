import {DataTransferObject} from '../../../shared/data-provider';

export class BenutzerDTO implements DataTransferObject {
  id: number;
  email: string;
  version: number;
  qrCode: string;

  static copyFrom(optional: {
    id?: number,
    email?: string,
    version?: number,
    qrCode?: string
  } = {}): BenutzerDTO {
    const copy = new BenutzerDTO();
    copy.id = optional.id || null;
    copy.email = optional.email || '';
    copy.version = optional.version || null;
    copy.qrCode = optional.qrCode || '';

    return copy;
  }
}
