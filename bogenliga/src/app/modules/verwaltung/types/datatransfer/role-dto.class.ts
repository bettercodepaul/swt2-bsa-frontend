import {DataTransferObject} from '../../../shared/data-provider';

export class RoleDTO implements DataTransferObject {
  roleId: number;
  roleName: string;
  version: number;

  static copyFrom(optional: {
    roleId?: number,
    roleName?: string,
    version?: number
  } = {}): RoleDTO {
    const copy = new RoleDTO();
    copy.roleId = optional.roleId || null;
    copy.roleName = optional.roleName || '';
    copy.version = optional.version || null;

    return copy;
  }
}
