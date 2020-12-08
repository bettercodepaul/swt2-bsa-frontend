import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class EinstellungenDO implements VersionedDataObject {
  id: number;
  version: number;

  e_value: string;
  e_key: string;

}
