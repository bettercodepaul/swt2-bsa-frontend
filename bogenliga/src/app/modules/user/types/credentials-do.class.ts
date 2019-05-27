import {DataObject} from '../../shared/data-provider';

export class CredentialsDO implements DataObject {
  username: string;
  password: string;
  rememberMe = false;
  code: string;

  constructor(username?: string, password?: string, code?: string) {
    this.username = !!username ? username : '';
    this.password = !!password ? password : '';
    this.code = !!code ? code : '';
  }
}
