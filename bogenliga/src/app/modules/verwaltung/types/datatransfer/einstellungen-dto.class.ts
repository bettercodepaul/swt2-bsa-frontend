import {DataTransferObject} from '../../../shared/data-provider';

export class EinstellungenDTO implements DataTransferObject {

  id: number;
  version: number;

  smtpName: string;
  smtpHost: string;
  smtpPort: number;
  smtpPasswort: string;

  static copyFrom(optional: {
    id?: number;
    version?: number;
    smtpName?: string;
    smtpHost?: string;
    smtpPort?: number;
    smtpPasswort?: string;

  } = {}): EinstellungenDTO {
    const copy = new EinstellungenDTO();
    copy.id = optional.id || null;
    copy.version = optional.version || null;
    copy.smtpName = optional.smtpName || '';
    copy.smtpHost = optional.smtpHost || '';
    copy.smtpPort = optional.smtpPort || null;
    copy.smtpPasswort = optional.smtpPasswort || '';

    return copy;
  }


}
