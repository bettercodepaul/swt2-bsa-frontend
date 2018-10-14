import {DataTransferObject} from '../../../shared/data-provider';

export class DsbMitgliedDTO implements DataTransferObject {
  id: number;
  vorname: string;
  nachname: string;
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
    geburtsdatum?: string,
    nationalitaet?: string,
    mitgliedsnummer?: string,
    vereinsId?: number,
    userId?: number,
    version?: number
  } = {}): DsbMitgliedDTO {
    const copy = new DsbMitgliedDTO();
    copy.id = optional.id || -1;
    copy.vorname = optional.vorname || '';
    copy.nachname = optional.nachname || '';
    copy.geburtsdatum = optional.geburtsdatum || '';
    copy.nationalitaet = optional.nationalitaet || '';
    copy.mitgliedsnummer = optional.mitgliedsnummer || '';
    copy.vereinsId = optional.vereinsId || -1;
    copy.userId = optional.userId || -1;
    copy.version = optional.version || -1;

    return copy;
  }
}
