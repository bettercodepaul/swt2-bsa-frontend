import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';


export class DisziplinDO implements VersionedDataObject {
  id: number;
  version: number;

  disziplinName: string;

}
