import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class DsbMannschaftDO implements VersionedDataObject {
  id: number;
  version: number;

  vereinId: number;
  nummer: number;
  benutzerId: number;
  veranstaltungID: number;
}
