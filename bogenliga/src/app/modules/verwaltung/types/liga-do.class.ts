import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';


export class LigaDO implements VersionedDataObject {
  id: number;
  version: number;
  name: string;
  regionId: number;
  disziplinId: number;
  regionName: string;
  ligaUebergeordnetId: number;
  ligaUebergeordnetName: string;
  ligaVerantwortlichId: number;
  ligaVerantwortlichMail: string;
  ligaDetailId: number;
  ligaDetail: string;

}
