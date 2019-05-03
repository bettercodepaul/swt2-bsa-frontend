import {DataTransferObject} from '@shared/data-provider';

export class VeranstaltungDTO implements DataTransferObject {
  // TODO:  if else for every number
  id: number;
  wettkampfTypId: number;
  name: string;
  sportjahr: number;
  meldedeadline: number;
  ligaLeiterId: number;
  version: number;

  static copyFrom(optional: {
    id?: number,
    wettkampfTypId?: number,
    name?: string,
    sportjahr?: number,
    meldedeadline?: number,
    ligaLeiterId?: number,

    version?: number
  } = {}): VeranstaltungDTO {
    const copy = new VeranstaltungDTO();

    // show '0' value
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }

    if (optional.wettkampfTypId >= 0) {
      copy.wettkampfTypId = optional.wettkampfTypId;
    } else {
      copy.wettkampfTypId = null;
    }

    if (optional.ligaLeiterId>= 0) {
      copy.ligaLeiterId= optional.ligaLeiterId;
    } else {
      copy.ligaLeiterId = null;
    }


    copy.name = optional.name || '';



    return copy;
  }
}
