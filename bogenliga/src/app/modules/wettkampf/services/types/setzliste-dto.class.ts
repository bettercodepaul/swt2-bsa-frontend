import {DataTransferObject} from '../../../shared/data-provider';

export class SetzlisteDTO implements DataTransferObject {

  static copyFromJson(json: {
    // id: number,
    // version: number,
    // email: string,
    // jwt: string,
    // permissions?: string[]
  }): SetzlisteDTO {
    const setzliste = new SetzlisteDTO();
    // userSign.id = json.id;
    // userSign.version = json.version;
    // userSign.email = json.email;
    // userSign.jwt = json.jwt;

    // userSign.permissions = [];

    // map string list to enum list
    // if (json.permissions) {
    //   json.permissions.forEach(permission => {
    //     const userPermission = UserPermission[permission];
    //     userSign.permissions.push(userPermission);
    //   });
    // }
    return setzliste;
  }

  constructor() {
  }

}
