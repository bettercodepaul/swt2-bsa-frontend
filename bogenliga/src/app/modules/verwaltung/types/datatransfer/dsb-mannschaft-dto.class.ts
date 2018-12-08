import {DataTransferObject} from '../../../shared/data-provider';

export class DsbMannschaftDTO implements DataTransferObject {
  id: number;
  nummer: string;
  vereinId: number;
  benutzerId: number;
  version: number;
  veranstaltungID: number;

  static copyFrom(optional: {
    id?: number,
    nummer?: string,
    vereinId?: number,
    benutzerId?: number,
    version?: number,
    veranstaltungID?: number;
  } = {}): DsbMannschaftDTO {
    const copy = new DsbMannschaftDTO();
    // show '0' value
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }
    copy.benutzerId = optional.benutzerId || null;
    copy.version = optional.version || null;
    copy.vereinId = optional.vereinId || null;
    copy.nummer = optional.nummer || '';
    copy.veranstaltungID = optional.veranstaltungID || null;

    return copy;
  }
}
