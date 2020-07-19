import {DataTransferObject, VersionedDataTransferObject} from '@shared/data-provider';

export class SportjahrVeranstaltungDTO implements DataTransferObject {


  id: number;
  sportjahr: number;
  version: number;

  static copyFrom(optional: {

    id?: number,
    sportjahr?: number,
    version?: number


  } = {}): SportjahrVeranstaltungDTO {
    const copy = new SportjahrVeranstaltungDTO();

    copy.id = optional.id;
    copy.sportjahr = optional.sportjahr;
    copy.version = optional.version;
    return copy;
  }
}
