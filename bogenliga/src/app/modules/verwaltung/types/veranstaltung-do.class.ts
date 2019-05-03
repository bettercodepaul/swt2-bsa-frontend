import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';


export class VeranstaltungDO implements VersionedDataObject {
  id: number;
  wettkampfTypId: number;
  name: string;
  sportjahr: number;
  meldedeadline: number;
  ligaLeiterId: number;
  version: number;




}
