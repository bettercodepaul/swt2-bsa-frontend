import {DataObject} from '../../shared/data-provider';

export class CredentialsDO implements DataObject {
  username: string;
  password: string;
  rememberMe = false;
}
