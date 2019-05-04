import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class WettkampfDO implements VersionedDataObject {

  veranstaltungsId: number;
  id: number;
  wettkampfTag: number;
  wettkampfDisziplinId: number;
  wettkampfTypId: number;
  version: number;
  createdByUserId: number;
  datum: string;
  wettkampfOrt: string;
  wettkampfBeginn: string;
  createdAtUtc: string;
}


