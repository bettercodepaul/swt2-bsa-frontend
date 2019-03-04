import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';


export class SportjahrDO implements VersionedDataObject {
  id: number;
  version: number;
  wettkampfTypId: number;
  wettkampfTypName: string;
  name: string;
  sportjahr: number;
  deadline: number;
  ligaleiterID: number;
  ligaleiterEmail: string;
}
