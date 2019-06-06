import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';


export class SportjahrDO implements VersionedDataObject {
  id: number;
  version: number;

  ligaName: string;
  regionName: string;
  ligaUebergeordnetName: string;
  verantworlichEmail: string;
}
