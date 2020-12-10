import {DataTransferObject} from '@shared/data-provider';

export class KampfrichterDTO implements DataTransferObject {
  id: number;
  wettkampfID: number;
  leitend: boolean;
  version: number;

  //TODO: Fix the userid to wettkampfID assignment so that name name, order and function are all correct

  // The attribute names of the optional have to be exactly the same as the getters in KampfrichterDTO.java
  static copyFrom(optional: {
    userID?: number;
    wettkampfID?: number;
    leitend?: boolean;
    version?: number;
  } = {}): KampfrichterDTO {
    const copy = new KampfrichterDTO();

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


    copy.leitend = optional.leitend;
    return copy;
  }
}
