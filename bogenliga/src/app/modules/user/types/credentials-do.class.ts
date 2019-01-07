import {DataObject} from '../../shared/data-provider';

export class CredentialsDO implements DataObject {
  username: string;
  password: string;
  rememberMe = false;

  constructor(username?: string, password?: string) {
    this.username = !!username ? username : '';
    this.password = !!password ? password : '';
  }
}
