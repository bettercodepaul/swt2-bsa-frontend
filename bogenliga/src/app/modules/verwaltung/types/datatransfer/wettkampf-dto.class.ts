import {DataTransferObject} from '@shared/data-provider';

export class WettkampfDTO implements DataTransferObject {
  // This maps the DTO from the Backend
  id: number;
  wettkampfDatum: string;
  wettkampfOrt: string;
  wettkampfBeginn: string;
  wettkampfTag: number;
  version: number;
  wettkampfVeranstaltungsId: number;

  // not set, find Liga by Wettkampfid
  wettkampfLiga: string;


  static copyFrom(optional: {
    id?: number,
    datum?: string,
    wettkampfOrt?: string,
    wettkampfBeginn?: string,
    wettkampfTag?: number,
    version?: number,
    veranstaltungsId?: number,
  } = {}): WettkampfDTO {
    const copy = new WettkampfDTO();

    // show '0' value
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }

    copy.wettkampfDatum = optional.datum || '';
    copy.wettkampfOrt = optional.wettkampfOrt || null;
    copy.wettkampfBeginn = optional.wettkampfBeginn || null;
    copy.wettkampfTag = optional.wettkampfTag || null;

    copy.version = optional.version || null;
    copy.wettkampfVeranstaltungsId = optional.veranstaltungsId || 0;

    return copy;
  }
}
