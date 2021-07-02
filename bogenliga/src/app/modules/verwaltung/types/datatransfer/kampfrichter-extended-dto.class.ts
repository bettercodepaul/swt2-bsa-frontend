import {DataTransferObject} from '@shared/data-provider';

export class kampfrichterExtendedDTO implements DataTransferObject {
  id: number;
  vorname: string;
  nachname: string;
  email:string;
  wettkampfID: number;
  leitend: boolean;
  version: number;

  // The attribute names of the optional have to be exactly the same as the getters in KampfrichterDTO.java
  static copyFrom(optional: {
    userID?: number;
    vorname?: string;
    nachname?: string;
    email?: string;
    wettkampfID?: number;
    leitend?: boolean;
    version?: number;

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
    copy.vorname = optional.vorname;
    copy.nachname = optional.nachname;
    copy.leitend = optional.leitend;
    return copy;
  }
}
