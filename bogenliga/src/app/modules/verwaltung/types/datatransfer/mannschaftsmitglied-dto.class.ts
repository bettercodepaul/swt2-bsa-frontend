import {DataTransferObject} from '@shared/data-provider';

export class MannschaftsmitgliedDTO implements DataTransferObject {
  id: number;
  version: number;
  mannschaftsId: number;
  dsbMitgliedId: number;
  dsbMitgliedEingesetzt: number;
  rueckennummer: number;

  static copyFrom(optional: {
    id?: number;
    version?: number;
    mannschaftsId?: number;
    dsbMitgliedId?: number;
    dsbMitgliedEingesetzt?: number;
    rueckennummer?: number;

  } = {}): MannschaftsmitgliedDTO {
    const copy = new MannschaftsmitgliedDTO();
    // show '0' value
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }
    copy.id = optional.id || null;
    copy.version = optional.version || null;
    copy.mannschaftsId = optional.mannschaftsId || null;
    copy.dsbMitgliedId = optional.dsbMitgliedId || null;
    if (optional.dsbMitgliedEingesetzt >= 0) {
      copy.dsbMitgliedEingesetzt = optional.dsbMitgliedEingesetzt;
    } else {
      copy.dsbMitgliedEingesetzt = null;
    }
    copy.rueckennummer = optional.rueckennummer

    return copy;
  }
}
