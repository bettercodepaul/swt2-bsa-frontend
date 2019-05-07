import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';


export class VeranstaltungDO implements VersionedDataObject {
  id: number;
  version: number;
  name: string;
  meldeDeadline: number;
  ligaleiterID: number;
  sportjahr: number;
  wettkampfTypId: number;
  //wettkampfTypName: string;

}
