import {DataObject} from '../../shared/data-provider';

export class CredentialsDO implements DataObject {
  username: string;
  password: string;
  newpassword: string;
  verifypassword: string;
  rememberMe = false;

  constructor(username?: string, password?: string) {
    this.username = !!username ? username : '';
    this.password = !!password ? password : '';
    this.newpassword = !!password ? password : '';
    this.verifypassword = !!password ? password : '';
  }
}
