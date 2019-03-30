import {DataTransferObject} from '../../../shared/data-provider';

export class SportjahrDTO implements DataTransferObject {
  id: number;
  version: number;
  wettkampfTypId: number;
  wettkampfTypName: string;
  name: string;
  sportjahr: number;
  deadline: number;
  ligaleiterID: number;
  ligaleiterEmail: string;

  static copyFrom(optional: {
    id?: number,
    version?: number
    wettkampfTypId?: number;
    wettkampfTypName?: string;
    name?: string;
    sportjahr?: number;
    deadline?: number;
    ligaleiterID?: number;
    ligaleiterEmail?: string;

  } = {}): SportjahrDTO {
    const copy = new SportjahrDTO();

    // show '0' value
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }

    if (optional.version >= 0) {
      copy.version = optional.version;
    } else {
      copy.version = null;
    }

    if (optional.wettkampfTypId >= 0) {
      copy.wettkampfTypId = optional.wettkampfTypId;
    } else {
      copy.version = null;
    }

    if (optional.sportjahr >= 0) {
      copy.sportjahr = optional.sportjahr;
    } else {
      copy.sportjahr = null;
    }

    if (optional.deadline >= 0) {
      copy.deadline = optional.deadline;
    } else {
      copy.deadline = null;
    }

    if (optional.ligaleiterID >= 0) {
      copy.ligaleiterID = optional.ligaleiterID;
    } else {
      copy.ligaleiterID = null;
    }

    copy.name = optional.name || '';
    copy.wettkampfTypName = optional.wettkampfTypName || '';
    copy.ligaleiterEmail = optional.ligaleiterEmail || '';


    return copy;
  }
}
