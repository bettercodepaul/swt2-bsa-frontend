import {DataTransferObject} from '@shared/data-provider';

export class VeranstaltungDTO implements DataTransferObject {

  id :number;
  version: number;
  wettkampfTypId: number;
  sportjahr: number;
  ligaleiterID: number;
  meldeDeadline: string;
  name: string;

  static copyFrom(optional: {
    id? :number,
    version?: number,
    wettkampfTypId?: number,
    sportjahr?: number,
    ligaleiterID?: number,
    meldeDeadline?: string,
    name?: string


  } = {}): VeranstaltungDTO {
    const copy = new VeranstaltungDTO();
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

    if (optional.version >= 0) {
      copy.version = optional.version;
    } else {
      copy.version = null;
    }


    copy.meldeDeadline = optional.meldeDeadline || '';
    copy.name = optional.name || '';


    return copy;
  }
}
