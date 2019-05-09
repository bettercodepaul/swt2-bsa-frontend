import {DataTransferObject} from '@shared/data-provider';

export class VeranstaltungDTO implements DataTransferObject {
  id: number;
  name: string;
  sportjahr: number;
  meldeDeadline: number;
  ligaleiterID: number;
  wettkampfTypId: number;
  // wettkampfTypName: string;
  version: number;

  static copyFrom(optional: {
    id?: number,
    name?: string,
    sportjahr?: number,
    meldeDeadline?: number,
    ligaleiterID?: number,
    wettkampfTypId?: number,
    // wettkampfTypName?: string,
    version?: number
  } = {}): VeranstaltungDTO {
    const copy = new VeranstaltungDTO();

    // show '0' value
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }

    if (optional.sportjahr >= 0) {
      copy.sportjahr = optional.sportjahr;
    } else {
      copy.sportjahr = null;
    }

    if (optional.meldeDeadline >= 0) {
      copy.meldeDeadline = optional.meldeDeadline;
    } else {
      copy.meldeDeadline = null;
    }

    if (optional.ligaleiterID >= 0) {
      copy.ligaleiterID = optional.ligaleiterID;
    } else {
      copy.ligaleiterID = null;
    }

    if (optional.wettkampfTypId >= 0) {
      copy.wettkampfTypId = optional.wettkampfTypId;
    } else {
      copy.wettkampfTypId = null;
    }


    copy.name = optional.name || '';
    // copy.wettkampfTypName = optional.wettkampfTypName || '';

    return copy;
  }
}
