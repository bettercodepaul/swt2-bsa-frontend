import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';
import {DataObject} from "../../shared/data-provider";

// bildet ab auf User-DTO auf Server-Seite
export class BenutzerRolleDO implements VersionedDataObject {
  id: number;
  email: string;
  roleId: number;
  roleName: string;
  version: number;
}


