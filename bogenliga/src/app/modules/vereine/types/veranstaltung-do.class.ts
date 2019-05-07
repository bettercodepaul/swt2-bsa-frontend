import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class VeranstaltungDO implements VersionedDataObject {

  id :number;
  version: number;
  wettkampfTypId: number;
  sportjahr: number;
  ligaleiterID: number;
  meldeDeadline: string;
  name: string;

}


