import {DataTransferObject} from '@shared/data-provider';

export class MannschaftsmitgliedDTO implements DataTransferObject {
  id: number;
  version: number;
  mannschaftsId: number;
  dsbMitgliedsId: number;
  istEingesetzt: boolean;

  static copyFrom(optional: {
    id?: number;
    version?: number;
    mannschaftsId?: number;
    dsbMitgliedsId?: number;
    istEingesetzt?: boolean;
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
    copy.dsbMitgliedsId = optional.dsbMitgliedsId || null;
    copy.istEingesetzt = optional.istEingesetzt || null;

    return copy;
  }
}
