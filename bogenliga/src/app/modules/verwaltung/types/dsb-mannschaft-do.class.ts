import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class DsbMannschaftDO implements VersionedDataObject {
  id: number;
  version: number;

  nummer: string;
  vereinId: number;
  userId: number;
}
