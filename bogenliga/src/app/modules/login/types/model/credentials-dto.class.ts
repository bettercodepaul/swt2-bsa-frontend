import {DataTransferObject} from '../../../shared/data-provider';

export class CredentialsDTO implements DataTransferObject {
  username: string;
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

}
