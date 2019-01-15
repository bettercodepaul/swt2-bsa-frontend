import {VersionedDataObject} from '../../../../shared/data-provider/models/versioned-data-object.interface';

export class UserRoleVersionedDataObject implements VersionedDataObject {
  id: number;
  roleId: number;
  name: string;

  version = 0;



  constructor(id: number, userRoleId: number, roleName: string) {
    this.id = id;
    this.roleId = userRoleId;
    this.name = roleName;
  }
}
