import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';
import {DataObject} from "../../shared/data-provider";

// bildet ab auf User-DTO auf Server-Seite
export class BenutzerDO implements VersionedDataObject {
  id: number;
  version: number;

  email: string;
}


