import {DataTransferObject} from '../../../shared/data-provider';

export class ResetCredentialsDTO implements DataTransferObject {
  newPassword: string;

  constructor(newPassword: string) {
    this.newPassword = newPassword;
  }

}
