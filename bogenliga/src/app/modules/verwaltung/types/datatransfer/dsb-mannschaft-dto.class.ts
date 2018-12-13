import {DataTransferObject} from '../../../shared/data-provider';

export class DsbMannschaftDTO implements DataTransferObject {
  id: number;
  nummer: number;
  vereinId: number;
  benutzerId: number;
  version: number;
  veranstaltungID: number;

  static copyFrom(optional: {
    id?: number,
    nummer?: number,
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

    if (optional.nummer >= 0) {
      copy.nummer = optional.nummer;
    } else {
      copy.nummer = null;
    }
    if (optional.veranstaltungID >= 0) {
      copy.veranstaltungID = optional.veranstaltungID;
    } else {
      copy.veranstaltungID = null;
    }
    copy.version = optional.version || null;

    return copy;
  }
}
