import {DataTransferObject} from '../../../shared/data-provider';

export class BenutzerCredentialsDTO implements DataTransferObject {
  username: string;
  password: string;

  static copyFrom(optional: {
    username?: string,
    password?: string,
  } = {}): BenutzerCredentialsDTO {
    const copy = new BenutzerCredentialsDTO();
    copy.username = optional.username || '';
    copy.password = optional.password || '';
    return copy;
  }
}
