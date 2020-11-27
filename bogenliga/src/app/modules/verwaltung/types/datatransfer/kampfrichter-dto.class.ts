import {DataTransferObject} from '@shared/data-provider';

export class KampfrichterDTO implements DataTransferObject {
  // TODO:  if else for every number
  id: number;
  wettkampfID: number;
  leitend: boolean;
  version: number;

  static copyFrom(optional: {
    userid?: number;
    id?: number;
    leitend?: boolean;
    version?: number;
  } = {}): KampfrichterDTO {
    const copy = new KampfrichterDTO();

    // show '0' value
    if (optional.userid >= 0) {
      copy.id = optional.userid;
    } else {
      copy.id = null;
    }

    if (optional.id >= 0) {
      copy.wettkampfID = optional.id;
    } else {
      copy.wettkampfID = null;
    }



    copy.leitend = optional.leitend;
    return copy;
  }
}
