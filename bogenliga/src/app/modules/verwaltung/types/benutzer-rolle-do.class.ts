import {DataObject} from '../../shared/data-provider';
import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

// bildet ab auf User-DTO auf Server-Seite
export class BenutzerRolleDO implements VersionedDataObject {
  id: number;
  email: string;
  active: boolean;
  roleId: number;
  roleName: string;
  version: number;
}


