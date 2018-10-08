import {DataTransferObject} from '../../../data-provider';
import {UserPermission} from './user-permission.enum';

export class UserSignInDTO implements DataTransferObject {

  id: number;
  version: number;
  email: string;
  jwt: string;
  permissions: UserPermission[];

  static copyFromJson(json: {
    id: number,
    version: number,
    email: string,
    jwt: string,
    permissions?: string[]
  }): UserSignInDTO {
    const userSign = new UserSignInDTO();
    userSign.id = json.id;
    userSign.version = json.version;
    userSign.email = json.email;
    userSign.jwt = json.jwt;

    userSign.permissions = [];

    // map string list to enum list
    if (json.permissions) {
      json.permissions.forEach(permission => {
        const userPermission = UserPermission[permission];
        userSign.permissions.push(userPermission);
      });
    }
    return userSign;
  }

  constructor() {
    this.id = 0;
    this.version = 0;
    this.email = null;
    this.jwt = null;
    this.permissions = null;
  }

}
