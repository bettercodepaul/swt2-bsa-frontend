import {DataTransferObject} from '../../../shared/data-provider';

export class BenutzerRolleDTO implements DataTransferObject {
  id: number;
  email: string;
  roleId: number;
  roleName: string;
  version: number;
  active: boolean;

  static copyFrom(optional: {
    id?: number,
    email?: string,
    roleId?: number,
    roleName?: string,
    version?: number;
    active?: boolean;
  } = {}): BenutzerRolleDTO {
    const copy = new BenutzerRolleDTO();
    copy.id = optional.id || null;
    copy.email = optional.email || '';
    copy.roleId = optional.roleId || null;
    copy.roleName = optional.roleName || '';
    copy.version = optional.version || null;
    copy.active = optional.active || false;
    return copy;
  }
}
