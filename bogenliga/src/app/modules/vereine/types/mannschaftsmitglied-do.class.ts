import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class MannschaftsmitgliedDO implements VersionedDataObject {
  id: number;
  version: number;
  mannschaftsId: number;
  dsbMitgliedId: number;
  dsbMitgliedEingesetzt: boolean;
  dsbMitgliedVorname: String;
  dsbMitgliedNachname: String;
}
