import {DataObject} from '../../shared/data-provider';

export class ChangeCredentialsDO implements DataObject {
  password: string;
  newPassword: string;
  verifyPassword: string;

  constructor(password?: string, newPassword?: string) {
    this.password = !!password ? password : '';
    this.newPassword = !!newPassword ? newPassword : '';
    this.verifyPassword = !!newPassword ? newPassword : '';
  }
}
