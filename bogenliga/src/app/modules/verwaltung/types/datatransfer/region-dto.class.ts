import {DataTransferObject} from '../../../shared/data-provider';

export class RegionDTO implements DataTransferObject {
  id: number;
  version: number;

  regionName: string;
  regionKuerzel: string;
  regionTyp: string;
  regionUebergeordnet: string;

  static copyFrom(optional: {
    id?: number,
    regionName?: string,
    regionKuerzel?: string,
    regionTyp?: string,
    regionUebergeordnet?: string,
    version?: number
  } = {}): RegionDTO {
    const copy = new RegionDTO();
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }
    copy.regionName = optional.regionName || '';
    copy.regionKuerzel = optional.regionKuerzel || '';
    copy.regionTyp = optional.regionTyp || '';
    copy.regionUebergeordnet = optional.regionUebergeordnet || '';

    copy.version = optional.version || null;

    return copy;
  }
}
