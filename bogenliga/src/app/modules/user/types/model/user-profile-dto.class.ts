import {DataTransferObject} from '../../../shared/data-provider';

export class UserProfileDTO implements DataTransferObject {
  id: number;
  vorname: string;
  nachname: string;
  email: string;
  geburtsdatum: string;
  nationalitaet: string;
  mitgliedsnummer: string;
  vereinsId: number;
  userId: number;
  version: number;

  static copyFrom(optional: {
    id?: number,
    vorname?: string,
    nachname?: string,
    email?: string;
    geburtsdatum?: string,
    nationalitaet?: string,
    mitgliedsnummer?: string,
    vereinsId?: number,
    userId?: number,
    version?: number
  } = {}): UserProfileDTO {
    const copy = new UserProfileDTO();

    // show '0' value
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }

    copy.vorname = optional.vorname || '';
    copy.nachname = optional.nachname || '';
    copy.email = optional.email || '';
    copy.geburtsdatum = optional.geburtsdatum || '';
    copy.nationalitaet = optional.nationalitaet || '';
    copy.mitgliedsnummer = optional.mitgliedsnummer || '';
    copy.vereinsId = optional.vereinsId || null;
    copy.userId = optional.userId || null;
    copy.version = optional.version || null;

    return copy;
  }
}
