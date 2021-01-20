import {DataTransferObject} from '@shared/data-provider';

export class VeranstaltungDTO implements DataTransferObject {
  id: number;
  wettkampfTypId: number;
  name: string;
  sportjahr: number;
  meldeDeadline: string;
  ligaleiterId: number;
  ligaId: number;
  version: number;
  ligaleiterEmail: string;
  wettkampftypName: string;
  ligaName: string;

  static copyFrom(optional: {
    id?: number,
    wettkampfTypId?: number,
    name?: string,
    sportjahr?: number,
    meldeDeadline?: string,
    ligaleiterId?: number,
    ligaId?: number,
    ligaleiterEmail?: string,
    wettkampftypName?: string,
    ligaName?: string,
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

    if (optional.ligaleiterId >= 0) {
      copy.ligaleiterId = optional.ligaleiterId;
    } else {
      copy.ligaleiterId = null;
    }
    if (optional.sportjahr >= 0) {
      copy.sportjahr = optional.sportjahr;
    } else {
      copy.sportjahr = null;
    }
    if (optional.ligaId >= 0) {
      copy.ligaId = optional.ligaId;
    } else {
      copy.ligaId = null;
    }
    if (optional.version >= 0) {
      copy.version = optional.version;
    } else {
      copy.version = null;
    }


    copy.name = optional.name || '';
    copy.meldeDeadline = optional.meldeDeadline || '';
    copy.ligaleiterEmail = optional.ligaleiterEmail || '';
    copy.wettkampftypName = optional.wettkampftypName || '';
    copy.ligaName = optional.ligaName || '';


    return copy;
  }
}
