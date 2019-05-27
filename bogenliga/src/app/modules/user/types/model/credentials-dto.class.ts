import {DataTransferObject} from '../../../shared/data-provider';

export class CredentialsDTO implements DataTransferObject {
  username: string;
  password: string;
  code: string;

  constructor(username: string, password: string, code?: string) {
    this.username = username;
    this.password = password;
    this.code = !!code ? code : null;
  }

}
