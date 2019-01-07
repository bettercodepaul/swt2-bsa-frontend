import {DataTransferObject} from '../../../shared/data-provider';

export class ChangeCredentialsDTO implements DataTransferObject {
  password: string;
  newpassword: string;

  constructor(password: string, newpassword: string) {
    this.password = password;
    this.newpassword = newpassword;
  }

}
