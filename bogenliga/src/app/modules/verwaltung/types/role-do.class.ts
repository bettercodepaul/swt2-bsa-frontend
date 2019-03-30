import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

import {DataObject} from '../../shared/data-provider';

// bildet ab auf Role-DTO auf Server-Seite
export class RoleDO implements VersionedDataObject {
  id: number;
  roleName: string;
  version: number;
}


