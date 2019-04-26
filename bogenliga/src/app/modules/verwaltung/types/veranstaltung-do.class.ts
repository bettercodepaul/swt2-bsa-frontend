import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';


export class VeranstaltungDO implements VersionedDataObject {
  id: number;
  version: number;

  wettkampfTypId: number;
  name: string;
  sportJahr: number;
  meldeDeadline: number;
  ligaLeiterId: number;




}
