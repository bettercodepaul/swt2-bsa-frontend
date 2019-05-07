import {DataTransferObject} from '@shared/data-provider';

export class RegionDTO implements DataTransferObject {
  id: number;
  version: number;

  regionName: string;
  regionKuerzel: string;
  regionTyp: string;
  regionUebergeordnet: number;

  regionUebergeordnetAsName: string;

  static copyFrom(optional: {
    id?: number,
    regionName?: string,
    regionKuerzel?: string,
    regionTyp?: string,
    regionUebergeordnet?: number,
    version?: number
  } = {}): RegionDTO {
    const copy = new RegionDTO();
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }

    if (optional.regionUebergeordnet >= 0) {
      copy.regionUebergeordnet = optional.regionUebergeordnet;
    } else {
      copy.regionUebergeordnet = null;
    }

    copy.regionUebergeordnetAsName = '';

    copy.regionName = optional.regionName || '';
    copy.regionKuerzel = optional.regionKuerzel || '';
    copy.regionTyp = optional.regionTyp || '';

    copy.version = optional.version || null;

    return copy;
  }
}
