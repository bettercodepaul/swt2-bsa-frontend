import {DataTransferObject} from '../../../shared/data-provider';

export class DisziplinDTO implements DataTransferObject {


  id: number;
  version: number;
  //disziplinId: number;
  disziplinName: string;



  static copyFrom(optional: {
    id?: number;
    version?: number;
    disziplinId?: number;
    disziplinName?: string;


  } = {}): DisziplinDTO {
    const copy = new DisziplinDTO();
    if (optional.disziplinId >= 0) {
      copy.id = optional.disziplinId;
    } else {
      copy.id = null;
    }
    copy.version = optional.version || null;
    //copy.disziplinId = optional.disziplinId || null;
    copy.disziplinName = optional.disziplinName || '';

    return copy;
  }


}
