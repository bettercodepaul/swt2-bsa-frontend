import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';


export class SportjahrVeranstaltungDO implements VersionedDataObject {

  id: number;
  sportjahr: number;
  version: number;


}
