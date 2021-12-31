import {DataTransferObject} from '@shared/data-provider';

export class LigasyncmannschaftsmitgliedDtoClass implements DataTransferObject {
  id: number;
  version: number;
  mannschaftsId: number;
  dsbMitgliedId: number;
  rueckennummer: number;

  static copyFrom(optional: {
    id?: number;
    version?: number;
    mannschaftsId?: number;
    dsbMitgliedId?: number;
    rueckennummer?: number;

  } = {}): LigasyncmannschaftsmitgliedDtoClass {
    const copy = new LigasyncmannschaftsmitgliedDtoClass();
    copy.id = optional.id || null;
    copy.version = optional.version || null;
    copy.mannschaftsId = optional.mannschaftsId || null;
    copy.dsbMitgliedId = optional.dsbMitgliedId || null;
    copy.rueckennummer = optional.rueckennummer || null;

    return copy;
  }
}
