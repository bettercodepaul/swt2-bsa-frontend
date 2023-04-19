import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';


export class LigadetailDO implements VersionedDataObject {
  id: number;
  version: number;

  ligaDetails: string;

}
