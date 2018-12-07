import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class UserProfileDO implements VersionedDataObject {
  id: number;
  version: number;

  vorname: string;
  nachname: string;
  email: string;
  geburtsdatum: string;
  nationalitaet: string;
  mitgliedsnummer: string;
  vereinsId: number;
  userId: number;
}
