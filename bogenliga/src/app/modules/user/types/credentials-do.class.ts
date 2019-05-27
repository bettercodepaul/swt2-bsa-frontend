import {DataObject} from '../../shared/data-provider';

export class CredentialsDO implements DataObject {
  username: string;
  password: string;
  rememberMe = false;
  code: string;
  isUsing2FA = false;

  constructor(username?: string, password?: string, code?: string, isUsing2FA?: boolean) {
    this.username = !!username ? username : '';
    this.password = !!password ? password : '';
    this.code = !!code ? code : '';
    this.isUsing2FA = isUsing2FA;
  }
}
