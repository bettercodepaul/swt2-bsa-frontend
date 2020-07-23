import {DataObject} from '../../shared/data-provider';

export class ResetCredentialsDO implements DataObject {
  newPassword: string;

  constructor(newPassword?: string) {
    this.newPassword = !!newPassword ? newPassword : '';
  }
}
