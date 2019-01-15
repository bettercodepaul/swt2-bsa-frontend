import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class DsbMannschaftDO implements VersionedDataObject {
  id: number;
  version: number;

  mannschaftsnummer: string;
  vereinsId: number;
  userId: number;
}
