import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';

export class RoleVersionedDataObject implements VersionedDataObject {

  id: number;
  roleName: string;
  version = 0;


  constructor(id: number, name: string) {
    this.id = id;
    this.roleName = name;
  }
}
