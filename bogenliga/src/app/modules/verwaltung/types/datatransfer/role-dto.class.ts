import {DataTransferObject} from '../../../shared/data-provider';
import {VersionedDataObject} from "../../../shared/data-provider/models/versioned-data-object.interface";
import {TableActionType} from "../../../shared/components/tables/types/table-action-type.enum";

export class RoleDTO implements DataTransferObject {
  id: number;
  roleName: string;
  version: number;

  static copyFrom(optional: {
    id?: number,
    roleName?: string,
    version?: number
  } = {}): RoleDTO {
    const copy = new RoleDTO();
    copy.id = optional.id || null;
    copy.roleName = optional.roleName || '';
    copy.version = optional.version || null;

    return copy;
  }

  constructor(id: number, roleName: string) {
    this.id = id;
    this.roleName = roleName;
    this.version = 0;
  }



}
