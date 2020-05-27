import {DataTransferObject} from '../../../data-provider';
import {UserPermission} from './user-permission.enum';

export class UserSignInDTO implements DataTransferObject {

  id: number;
  version: number;
  email: string;
  qrCode: string;
  jwt: string;
  permissions: string[];
  // permissionsID: UserPermission[];

  static copyFromJson(json: {
    id: number,
    version: number,
    email: string,
    qrCode: string,
    jwt: string,
    permissions?: string[]
  }): UserSignInDTO {
    const userSign = new UserSignInDTO();
    userSign.id = json.id;
    userSign.version = json.version;
    userSign.email = json.email;
    userSign.qrCode = json.qrCode;
    userSign.jwt = json.jwt;
    userSign.permissions = [];
    // userSign.permissionsID = [];
    // do not map permissions to enum-values here because the mapping is done in
    // the current-user-service from the String to the value (e.g. "CAN_READ_DEFAULT" -> 0).
    // Therefore the refresh by pressing "F5" will not set the permissions right away
    // in the frontend an will not show the icons within the sidebar to navigate through
    // the options you should be able to navigate.
    if (json.permissions) {
      json.permissions.forEach((permission) => {
        userSign.permissions.push(permission);
      });
    }
    return userSign;
  }

  constructor() {
    this.id = 0;
    this.version = 0;
    this.email = null;
    this.qrCode = null;
    this.jwt = null;
    this.permissions = null;
    // this.permissionsID = null;
  }

}
