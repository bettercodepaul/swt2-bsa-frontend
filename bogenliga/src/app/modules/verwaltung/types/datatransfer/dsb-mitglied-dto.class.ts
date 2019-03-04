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
  kampfrichter: boolean;

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
    kampfrichter?: boolean;
  } = {}): DsbMitgliedDTO {
    const copy = new DsbMitgliedDTO();

    // show '0' value
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }

    copy.vorname = optional.vorname || '';
    copy.nachname = optional.nachname || '';
    copy.geburtsdatum = optional.geburtsdatum || '';
    copy.nationalitaet = optional.nationalitaet || '';
    copy.mitgliedsnummer = optional.mitgliedsnummer || '';
    copy.vereinsId = optional.vereinsId || null;
    copy.userId = optional.userId || null;
    copy.version = optional.version || null;
    copy.kampfrichter = optional.kampfrichter || false;

    return copy;
  }
}
