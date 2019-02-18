import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class MannschaftsMitgliedDO implements VersionedDataObject {
  id: number;
  version: number;

  mannschaftsId: number;
  dsbMitgliedsId: number;
  istEingesetzt: boolean;
}
