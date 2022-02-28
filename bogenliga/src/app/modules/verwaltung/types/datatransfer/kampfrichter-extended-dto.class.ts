import {DataTransferObject} from '@shared/data-provider';

export class kampfrichterExtendedDTO implements DataTransferObject {
  id: number;
  vorname: string;
  nachname: string;
  email: string;
  wettkampfID: number;
  leitend: boolean;
  version: number;
  vorNachName: string;

  // The attribute names of the optional have to be exactly the same as the getters in KampfrichterDTO.java
  static copyFrom(optional: {
    userID?: number;
    kampfrichterVorname?: string;
    kampfrichterNachname?: string;
    email?: string;
    wettkampfID?: number;
    leitend?: boolean;
    version?: number;
    vorNachName?: string;

  } = {}): kampfrichterExtendedDTO {
    const copy = new kampfrichterExtendedDTO();

    // show '0' value
    if (optional.userID >= 0) {
      copy.id = optional.userID;
    } else {
      copy.id = null;
    }

    if (optional.wettkampfID >= 0) {
      copy.wettkampfID = optional.wettkampfID;
    } else {
      copy.wettkampfID = null;
    }

    copy.email = optional.email;
    copy.vorname = optional.kampfrichterVorname;
    copy.nachname = optional.kampfrichterNachname;
    copy.leitend = optional.leitend;
    copy.vorNachName = optional.kampfrichterVorname + ' ' + optional.kampfrichterNachname;
    return copy;
  }
}
