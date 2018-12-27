import {DataTransferObject} from '../../../shared/data-provider';

export class LigaDTO implements DataTransferObject {
  id: number;
  name: string;
  regionId: number;
  regionName: string;
  ligaUebergeordnetId: number;
  ligaUebergeordnetName: string;
  ligaVerantwortlichId: number;
  ligaVerantwortlichMail: string;

  static copyFrom(optional: {
    id?: number,
    name?: string,
    regionId?: number,
    regionName?: string,
    ligaUebergeordnetId?: number,
    ligaUebergeordnetName?: string,
    ligaVerantwortlichId?: number,
    ligaVerantwortlichMail?: string
  } = {}): LigaDTO {
    const copy = new LigaDTO();

    // show '0' value
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }

    copy.name = optional.name || '';
    copy.regionId = optional.regionId || null;
    copy.regionName = optional.regionName || null;
    copy.ligaUebergeordnetId = optional.ligaUebergeordnetId || null;
    copy.ligaUebergeordnetName = optional.ligaUebergeordnetName || null;
    copy.ligaVerantwortlichId = optional.ligaVerantwortlichId || null;

    copy.ligaVerantwortlichMail = optional.ligaVerantwortlichMail || null;

    return copy;
  }
}
