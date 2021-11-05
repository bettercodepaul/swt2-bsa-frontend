import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';


export class KampfrichterDO implements VersionedDataObject {
  id: number;
  wettkampfID: number;
  leitend: boolean;
  version: number;

}
