import {DataTransferObject} from '@shared/data-provider';

export class DsbMannschaftDTO implements DataTransferObject {
  id: number;
  nummer: string;
  vereinId: number;
  benutzerId: number;
  version: number;
  veranstaltungId: number;
  name: string;
  sortierung: number;
  sportjahr: number;
  veranstaltungName: string;
  wettkampfTag: string;
  wettkampfOrtsname: string;
  vereinName: string;
  mannschaftNummer: number;

  static copyFrom(optional: {
    id?: number,
    nummer?: string,
    vereinId?: number,
    benutzerId?: number,
    version?: number,
    veranstaltungId?: number,
    name?: string,
    sortierung?: number,
    sportjahr?: number,
    veranstaltungName?: string,
    wettkampfTag?: string,
    wettkampfOrtsname?: string,
    vereinName?: string,
    mannschaftNummer?: number,
  } = {}): DsbMannschaftDTO {
    const copy = new DsbMannschaftDTO();

    // show '0' value
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }

    if (optional.benutzerId >= 0) {
      copy.benutzerId = optional.benutzerId;
    } else {
      copy.benutzerId = null;
    }

    if (optional.vereinId >= 0) {
      copy.vereinId = optional.vereinId;
    } else {
      copy.vereinId = null;
    }

    if (optional.veranstaltungId >= 0) {
      copy.veranstaltungId = optional.veranstaltungId;
    } else {
      copy.veranstaltungId = null;
    }

    if (optional.sortierung >= 0) {
      copy.sortierung = optional.sortierung;
    } else {
      copy.sortierung = null;
    }
    if (optional.sportjahr >= 0) {
      copy.sportjahr = optional.sportjahr;
    } else {
      copy.sportjahr = null;
    }
    if (optional.mannschaftNummer >= 0) {
      copy.mannschaftNummer = optional.mannschaftNummer;
    } else {
      copy.mannschaftNummer = null;
    }

    copy.version = optional.version || null;
    copy.nummer = optional.nummer || '';
    copy.name = optional.name || '';
    copy.veranstaltungName = optional.veranstaltungName || '';
    copy.wettkampfTag = optional.wettkampfTag || '';
    copy.wettkampfOrtsname = optional.wettkampfOrtsname || '';
    copy.vereinName = optional.vereinName || '';

    return copy;
  }
}
