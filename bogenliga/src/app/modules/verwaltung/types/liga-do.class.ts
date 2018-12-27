import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';


export class LigaDO implements VersionedDataObject {
  id: number;
  name: string;
  regionId: number;
  regionName: string;
  ligaUebergeordnetId: number;
  ligaUebergeordnetName: string;
  ligaVerantwortlichId: number;
  ligaVerantwortlichMail: string;

}
