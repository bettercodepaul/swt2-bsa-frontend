import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';


export class LizenzDO implements VersionedDataObject {

  id: number;
  version:number;
  lizenzId: number;
  lizenznummer: string;
  lizenzRegionId: number;
  lizenzDsbMitgliedId: number;
  lizenztyp: string;
  lizenzDisziplinId: number;

}
