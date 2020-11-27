import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class EinstellungenDO implements VersionedDataObject {
  id: number;
  version: number;

  smtpName: string;
  smtpHost: string;
  smtpPort: number;
  smtpPasswort: string;
}
