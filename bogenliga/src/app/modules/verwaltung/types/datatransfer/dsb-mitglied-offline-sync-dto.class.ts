import {DataTransferObject} from '@shared/data-provider';

export class DsbMitgliedOfflineSyncDto implements DataTransferObject {
  id: number;
  version: number;

  vorname: string;
  nachname: string;
  geburtsdatum: string;
  nationalitaet: string;
  mitgliedsnummer: string;
  vereinId: number;
  benutzerId: number;
  vereinsName: string;
  beitrittsdatum: string;

  static copyFrom(optional: {
    id?: number,
    version?: number,
    vorname?: string,
    nachname?: string,
    geburtsdatum?: string,
    nationalitaet?: string,
    mitgliedsnummer?: string,
    vereinId?: number,
    vereinsName?: string,
    beitrittsdatum?: string,
  } = {}): DsbMitgliedOfflineSyncDto {
    const copy = new DsbMitgliedOfflineSyncDto();

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
    copy.version = optional.version || null;
    copy.vereinId = optional.vereinId || null;
    copy.vereinsName = optional.vereinsName || '';
    copy.beitrittsdatum = optional.beitrittsdatum || '';
    return copy;
  }
}
