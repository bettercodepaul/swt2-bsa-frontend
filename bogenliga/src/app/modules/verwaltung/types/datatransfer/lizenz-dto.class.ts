import {DataTransferObject} from '../../../shared/data-provider';

export class LizenzDTO implements DataTransferObject {

    id: number;
    version: number;
    lizenzId: number;
    lizenznummer: string;
    lizenzRegionId: number;
    lizenzDsbMitgliedId: number;
    lizenztyp: string;
    lizenzDisziplinId: number;


  static copyFrom(optional: {
    id?: number;
    version?: number;
    lizenzId?: number;
    lizenznummer?: string;
    lizenzRegionId?: number;
    lizenzDsbMitgliedId?: number;
    lizenzDisziplinId?: number;
    lizenztyp?: string;
  } = {}): LizenzDTO {
    const copy = new LizenzDTO();
    copy.id = optional.id || null;
    copy.version = optional.version || null;
    copy.lizenzId = optional.lizenzId || null;
    copy.lizenznummer = optional.lizenznummer || '';
    copy.lizenzRegionId = optional.lizenzRegionId || null;
    copy.lizenzDsbMitgliedId = optional.lizenzDsbMitgliedId || null;
    copy.lizenztyp = optional.lizenztyp || '';
    if (optional.lizenzDisziplinId == null) { // Bei LizenzDisziplinId wird '0' als null gewertet. Deshalb hier anders.
      copy.lizenzDisziplinId = null;
    }
    else {
      copy.lizenzDisziplinId = optional.lizenzDisziplinId;
    }

    return copy;
  }
}
