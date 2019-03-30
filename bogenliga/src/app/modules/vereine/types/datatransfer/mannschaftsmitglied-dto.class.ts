import {DataTransferObject} from '../../../shared/data-provider';

export class MannschaftsMitgliedDTO implements DataTransferObject {
  id: number;
  version: number;
  mannschaftsId: number;
  dsbMitgliedId: number;
  dsbMitgliedEingesetzt: boolean;
  dsbMitgliedVorname: string;
  dsbMitgliedNachname: string;

  static copyFrom(optional: {
    id?: number;
    mannschaftsId?: number,
    dsbMitgliedId?: number,
    dsbMitgliedEingesetzt?: boolean,
    dsbMitgliedVorname?: string,
    dsbMitgliedNachname?: string,
  } = {}): MannschaftsMitgliedDTO {
    const copy = new MannschaftsMitgliedDTO();
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }
    if (optional.mannschaftsId >= 0) {
      copy.mannschaftsId = optional.mannschaftsId;
    } else {
      copy.mannschaftsId = null;
    }

    if (optional.dsbMitgliedId >= 0) {
      copy.dsbMitgliedId = optional.dsbMitgliedId;
    } else {
      copy.dsbMitgliedId = null;
    }

    copy.dsbMitgliedEingesetzt = optional.dsbMitgliedEingesetzt;
    copy.dsbMitgliedVorname = optional.dsbMitgliedVorname;
    copy.dsbMitgliedNachname = optional.dsbMitgliedNachname;

    return copy;
  }
}
