import {DataTransferObject} from '@shared/data-provider';

export class WettkampfDTO implements DataTransferObject {
  // This maps the DTO from the Backend
  id: number;
  veranstaltungsId: number;
  datum: string;
  wettkampfOrt: string;
  wettkampfBeginn: string;
  wettkampfTag: number;
  wettkampfDisziplinId: number;
  wettkampfTypId: number;

  version: number;


  static copyFrom(optional: {
    id?: number;
    veranstaltungsId?: number;
    datum?: string;
    wettkampfOrt?: string;
    wettkampfBeginn?: string;
    wettkampfTag?: number;
    wettkampfDisziplinId?: number;
    wettkampfTypId?: number;

    version?: number;
  } = {}): WettkampfDTO {
    const copy = new WettkampfDTO();

    // show '0' value
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }
    if (optional.veranstaltungsId >= 0) {
      copy.veranstaltungsId = optional.veranstaltungsId;
    } else {
      copy.veranstaltungsId = null;
    }
    if (optional.wettkampfTag >= 0) {
      copy.wettkampfTag = optional.wettkampfTag;
    } else {
      copy.wettkampfTag = null;
    }
    if (optional.wettkampfDisziplinId >= 0) {
      copy.wettkampfDisziplinId = optional.wettkampfDisziplinId;
    } else {
      copy.wettkampfDisziplinId = null;
    }
    if (optional.wettkampfTypId >= 0) {
      copy.wettkampfTypId = optional.wettkampfTypId;
    } else {
      copy.wettkampfTypId = null;
    }

    copy.datum = optional.datum || '';
    copy.wettkampfOrt = optional.wettkampfOrt || null;
    copy.wettkampfBeginn = optional.wettkampfBeginn || null;


    copy.version = optional.version || null;

    return copy;
  }
}
