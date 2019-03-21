import {DataTransferObject} from '../../../shared/data-provider';

export class ChangeCredentialsDTO implements DataTransferObject {
  password: string;
  newPassword: string;

  constructor(password: string, newPassword: string) {
    this.password = password;
    this.newPassword = newPassword;
  }

}
