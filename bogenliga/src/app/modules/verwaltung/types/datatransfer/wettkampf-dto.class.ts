import {DataTransferObject} from '@shared/data-provider';

export class WettkampfDTO implements DataTransferObject {
  // This maps the DTO from the Backend

  id: number;
  wettkampfVeranstaltungsId: number;
  wettkampfDatum: string;
  wettkampfOrt: string;
  wettkampfBeginn: string;
  wettkampfTag: number;
  wettkampfDisziplinId: number;
  wettkampfTypId: number;
  version: number;
  wettkampfAusrichter: number;

  constructor(id?: number,
              wettkampfVeranstaltungsId?: number,
              wettkampfDatum?: string,
              wettkampfOrt?: string,
              wettkampfBeginn?: string,
              wettkampfTag?: number,
              wettkampfDisziplinId?: number,
              wettkampfTypId?: number,
              version?: number,
              wettkampfAusrichter ?: number) {
    this.id = !!id ? id : null;
    this.wettkampfVeranstaltungsId = !!wettkampfVeranstaltungsId ? wettkampfVeranstaltungsId : null;
    this.wettkampfDatum = !!wettkampfDatum ? wettkampfDatum : '';
    this.wettkampfOrt = !!wettkampfOrt ? wettkampfOrt : '';
    this.wettkampfBeginn = !!wettkampfBeginn ? wettkampfBeginn : '';
    this.wettkampfTag = !!wettkampfTag ? wettkampfTag : null;
    this.wettkampfDisziplinId = !!wettkampfDisziplinId ? wettkampfDisziplinId : null;
    this.wettkampfTypId = !!wettkampfTypId ? wettkampfTypId : null;
    this.version = !!version ? version : null;
    this.wettkampfAusrichter = !!wettkampfAusrichter ? wettkampfAusrichter : null;
  }


  static copyFrom(optional: {
    id?: number;
    wettkampfVeranstaltungsId?: number;
    datum?: string;
    wettkampfOrt?: string;
    wettkampfBeginn?: string;
    wettkampfTag?: number;
    wettkampfDisziplinId?: number;
    wettkampfTypId?: number;
    version?: number;
    wettkampfAusrichter?: number;
  } = {}): WettkampfDTO {
    const copy = new WettkampfDTO();

    // show '0' value
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }
    if (optional.wettkampfVeranstaltungsId >= 0) {
      copy.wettkampfVeranstaltungsId = optional.wettkampfVeranstaltungsId;
    } else {
      copy.wettkampfVeranstaltungsId = null;
    }
    copy.wettkampfDatum = optional.datum || '';
    copy.wettkampfOrt = optional.wettkampfOrt || null;
    copy.wettkampfBeginn = optional.wettkampfBeginn || null;

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
    copy.version = optional.version || null;
    if (optional.wettkampfAusrichter >= 0) {
      copy.wettkampfAusrichter = optional.wettkampfAusrichter;
    } else {
      copy.wettkampfAusrichter = null;
    }

    return copy;
  }


}
