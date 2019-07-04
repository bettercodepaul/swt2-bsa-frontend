import {DataTransferObject} from '@shared/data-provider';

export class KampfrichterDTO implements DataTransferObject {
  // TODO:  if else for every number
  id: number;
  userid: number;
  leitend: boolean;
  version: number;

  static copyFrom(optional: {
    id?: number;
    userid?: number;
    leitend?: boolean;
    version?: number;
  } = {}): KampfrichterDTO {
    const copy = new KampfrichterDTO();

    // show '0' value
    if (optional.userid >= 0) {
      copy.userid = optional.userid;
    } else {
      copy.userid = null;
    }

    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }



    copy.leitend = optional.leitend;
    return copy;
  }
}
