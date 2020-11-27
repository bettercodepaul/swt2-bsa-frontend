import {DataTransferObject} from '@shared/data-provider';

export class KampfrichterDTO implements DataTransferObject {
  id: number;
  wettkampfID: number;
  leitend: boolean;
  version: number;

  //TODO: Fix the userid to wettkampfID assignment so that name name, order and function are all correct

  // Apparently you can't change the parameter names here without consequences
  static copyFrom(optional: {
    id?: number;
    userid?: number;
    leitend?: boolean;
    version?: number;
  } = {}): KampfrichterDTO {
    const copy = new KampfrichterDTO();

    // show '0' value
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }

    if (optional.userid >= 0) {
      copy.wettkampfID = optional.userid;
    } else {
      copy.wettkampfID = null;
    }


    copy.leitend = optional.leitend;
    return copy;
  }
}
