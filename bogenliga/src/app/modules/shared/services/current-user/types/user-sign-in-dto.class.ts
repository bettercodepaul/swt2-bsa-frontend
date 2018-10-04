import {DataTransferObject} from '../../../data-provider';
import {UserPermission} from './user-permission.enum';

export class UserSignInDTO implements DataTransferObject {

  id: number;
  version: number;
  email: string;
  jwt: string;
  permissions: UserPermission[];

  constructor(json: {
    id: number,
    version: number,
    email: string,
    jwt: string,
    permissions?: string[]
  }) {
    this.id = json.id;
    this.version = json.version;
    this.email = json.email;
    this.jwt = json.jwt;

    this.permissions = [];

    // map string list to enum list
    if (json.permissions) {
      json.permissions.forEach(permission => {
        const userPermission = UserPermission[permission];
        this.permissions.push(userPermission);
      });
    }
  }

}
