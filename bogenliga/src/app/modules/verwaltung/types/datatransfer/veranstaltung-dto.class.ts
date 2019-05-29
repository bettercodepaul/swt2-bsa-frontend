import {DataTransferObject} from '@shared/data-provider';

export class VeranstaltungDTO implements DataTransferObject {
  // TODO:  if else for every number
  id: number;
  wettkampfTypId: number;
  name: string;
  sportjahr: number;
  meldeDeadline: string;
  ligaleiterID: number;
  ligaID: number;
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
    ligaleiterID?: number,
    ligaID?: number,
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

    if (optional.ligaleiterID>= 0) {
      copy.ligaleiterID= optional.ligaleiterID;
    } else {
      copy.ligaleiterID = null;
    }
    if (optional.sportjahr >= 0){
      copy.sportjahr = optional.sportjahr;
    }else{
      copy.sportjahr = null;
    }
    if(optional.ligaID >= 0){
      copy.ligaID = optional.ligaID;
    }else{
      copy.ligaID = null;
    }

    copy.name = optional.name || '';
    copy.meldeDeadline = optional.meldeDeadline || '';
    copy.ligaleiterEmail = optional.ligaleiterEmail || '';
    copy.wettkampftypName = optional.wettkampftypName || '';
    copy.ligaName = optional.ligaName || '';


    return copy;
  }
}
