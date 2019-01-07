import {DataObject} from '../../shared/data-provider';

export class ChangeCredentialsDO implements DataObject {
  password: string;
  newpassword: string;
  verifypassword: string;

  constructor(username?: string, password?: string) {
    this.password = !!password ? password : '';
    this.newpassword = !!password ? password : '';
    this.verifypassword = !!password ? password : '';
  }
}
