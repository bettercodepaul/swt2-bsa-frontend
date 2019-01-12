import {DataTransferObject} from '../../../shared/data-provider';

export class BenutzerRolleDTO implements DataTransferObject {
  id: number;
  email: string;
  roleId: number;
  roleName: string;
  version: number;

  static copyFrom(optional: {
    id?: number,
    email?: string,
    roleId?: number,
    roleName?: string,
    version?: number
  } = {}): BenutzerRolleDTO {
    const copy = new BenutzerRolleDTO();
    copy.id = optional.id || null;
    copy.email = optional.email || '';
    copy.roleId = optional.roleId || null;
    copy.roleName = optional.roleName || '';
    copy.version = optional.version || null;

    return copy;
  }
}
