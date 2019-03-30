import {DataObject} from '../../shared/data-provider';
import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

// bildet ab auf User-DTO auf Server-Seite
export class BenutzerDO implements VersionedDataObject {
  id: number;
  version: number;

  email: string;
}


