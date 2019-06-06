import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';


export class WettkampfDO implements VersionedDataObject {
  id: number;
  veranstaltungsId: number;
  datum: string;
  wettkampfOrt: string;
  wettkampfBeginn: string;
  wettkampfTag: number;
  wettkampfDisziplinId: number;
  wettkampfTypId: number;

  version: number;


}
