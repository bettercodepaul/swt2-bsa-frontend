import {DataTransferObject} from '../../../shared/data-provider';

export class UserRolleDTO implements DataTransferObject {
  id: number;
  email: string;
  roleId: number;
  roleName: string;
  version: number;
  active: boolean;
  dsbMitgliedNachname: string;
  dsbMitgliedVorname: string;


  static copyFrom(optional: {
    id?: number,
    email?: string,
    roleId?: number,
    roleName?: string,
    version?: number;
    active?: boolean;
    dsbMitgliedNachname?: string;
    dsbMitgliedVorname?: string;

  } = {}): UserRolleDTO {
    const copy = new UserRolleDTO();
    copy.id = optional.id || null;
    copy.email = optional.email || '';
    copy.roleId = optional.roleId || null;
    copy.roleName = optional.roleName || '';
    copy.version = optional.version || null;
    copy.active = optional.active || false;
    copy.dsbMitgliedNachname = optional.dsbMitgliedNachname || '';
    copy.dsbMitgliedVorname = optional.dsbMitgliedVorname || '';
    return copy;
  }
}
