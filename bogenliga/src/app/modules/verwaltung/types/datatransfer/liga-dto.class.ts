import {DataTransferObject} from '@shared/data-provider';

export class LigaDTO implements DataTransferObject {
  // TODO:  if else for every number
  id: number;
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
  version: number;

  static copyFrom(optional: {
    id?: number,
    name?: string,
    regionId?: number,
    disziplinId?: number;
    regionName?: string,
    ligaUebergeordnetId?: number,
    ligaUebergeordnetName?: string,
    ligaVerantwortlichId?: number,
    ligaVerantwortlichMail?: string,
    ligaDetailId?: number;
    ligaDetail?: string;
    version?: number
  } = {}): LigaDTO {
    const copy = new LigaDTO();

    // show '0' value
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }

    if (optional.regionId >= 0) {
      copy.regionId = optional.regionId;
    } else {
      copy.regionId = null;
    }

    if (optional.ligaUebergeordnetId >= 0) {
      copy.ligaUebergeordnetId = optional.ligaUebergeordnetId;
    } else {
      copy.ligaUebergeordnetId = null;
    }

    if (optional.ligaVerantwortlichId >= 0) {
      copy.ligaVerantwortlichId = optional.ligaVerantwortlichId;
    } else {
      copy.ligaVerantwortlichId = null;
    }

    if (optional.disziplinId >= 0) {
      copy.disziplinId = optional.disziplinId;
    } else {
      copy.disziplinId = null;
    }

    if (optional.ligaDetailId >= 0 || optional.ligaDetailId == null) {
      // copy.ligaDetailId = optional.ligaDetailId;
      copy.ligaDetailId = 123;
    } else {
      copy.ligaDetailId = 321;
    }



    copy.name = optional.name || '';
    copy.regionName = optional.regionName || '';
    copy.ligaUebergeordnetName = optional.ligaUebergeordnetName || '';
    copy.ligaVerantwortlichMail = optional.ligaVerantwortlichMail || '';
    copy.ligaDetail = optional.ligaDetail || null;

    return copy;
  }
}
