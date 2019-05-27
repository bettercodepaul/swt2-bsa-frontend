import {DataTransferObject} from '../../../shared/data-provider';

export class CredentialsDTO implements DataTransferObject {
  username: string;
  password: string;
  isUsing2FA = false;
  code: string;

  constructor(username: string, password: string, isUsing2FA: boolean, code?: string) {
    this.username = username;
    this.password = password;
    this.isUsing2FA = isUsing2FA;
    this.code = !!code ? code : null;
  }

}
