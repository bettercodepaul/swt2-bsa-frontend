import {DataTransferObject} from '../../../shared/data-provider';

export class CredentialsDTO implements DataTransferObject {
  username: string;
  password: string;
  twoFAenabled = false;
  code: string;

  constructor(username: string, password: string, twoFAenabled: boolean, code?: string) {
    this.username = username;
    this.password = password;
    this.twoFAenabled = twoFAenabled;
    this.code = !!code ? code : null;
  }

}
