import {DataTransferObject} from '../../../shared/data-provider';

export class MannschaftDTO implements DataTransferObject {
  id: number;
  version: number;

  vereinId: number;
  mannschaftsNummer: number;
  benutzerId: number;
  veranstaltungId: number;

  static copyFrom(optional: {
    id?: number;
    version?: number;

    vereinId?: number;
    mannschaftsNummer?: number;
    benutzerId?: number;
    veranstaltungId?: number;
  } = {}): MannschaftDTO {
    const copy = new MannschaftDTO();
    copy.id = optional.id || null;
    copy.version = optional.version || null;
    copy.vereinId = optional.vereinId || null;
    copy.mannschaftsNummer =  optional.mannschaftsNummer || null;
    copy.benutzerId = optional.benutzerId || null;
    copy.veranstaltungId = optional.veranstaltungId || null;

    return copy;
  }
}
