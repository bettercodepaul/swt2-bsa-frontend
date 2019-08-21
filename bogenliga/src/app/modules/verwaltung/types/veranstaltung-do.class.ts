import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';


export class VeranstaltungDO implements VersionedDataObject {
  id: number;
  wettkampfTypId: number;
  name: string;
  sportjahr: number;
  meldeDeadline: string;
  ligaleiterId: number;
  ligaId: number;
  version: number;
  ligaleiterEmail: string;
  wettkampftypName: string;
  ligaName: string;



}
