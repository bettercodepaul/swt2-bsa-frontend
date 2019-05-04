import {DataTransferObject} from '@shared/data-provider';

export class WettkampfDTO implements DataTransferObject {


  veranstaltungsId: number;
  id: number;
  wettkampfTag: number;
  wettkampfDisziplinId: number;
  wettkampfTypId: number;
  version: number;
  createdByUserId: number;
  datum: string;
  wettkampfOrt: string;
  wettkampfBeginn: string;
  createdAtUtc: string;

  static copyFrom(optional: {
    veranstaltungsId?: number,
    id?: number,
    wettkampfTag?: number,
    wettkampfDisziplinId?: number,
    wettkampfTypId?: number,
    createdByUserId?: number,
    datum?: string,
    wettkampfOrt?: string,
    wettkampfBeginn?: string,
    createdAtUtc?: string,
    version?: number

  } = {}): WettkampfDTO {
    const copy = new WettkampfDTO();
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

    if (optional.createdByUserId >= 0) {
      copy.createdByUserId = optional.createdByUserId;
    } else {
      copy.createdByUserId = null;
    }

    if (optional.version >= 0) {
      copy.version = optional.version;
    } else {
      copy.version = null;
    }

    copy.datum = optional.datum || '';
    copy.wettkampfOrt = optional.wettkampfOrt || 'test';
    copy.wettkampfBeginn = optional.wettkampfBeginn || '';
    copy.createdAtUtc = optional.createdAtUtc || '';


    return copy;
  }
}
