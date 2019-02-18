import {DataTransferObject} from '../../../shared/data-provider';

export class RegionDTO implements DataTransferObject {
  id: number;
  version: number;

  regionName: string;
  regionKuerzel: string;
  regionTyp: string;
  regionUebergeordnet: number;

  static copyFrom(optional: {
    id?: number,
    name?: string,
    kuerzel?: string,
    typ?: string,
    uebergeordnet?: number,
    version?: number
  } = {}): RegionDTO {
    const copy = new RegionDTO();
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }

    if (optional.uebergeordnet >= 0) {
      copy.regionUebergeordnet = optional.uebergeordnet;
    }
    {
      copy.regionUebergeordnet = null;
    }

    copy.regionName = optional.name || '';
    copy.regionKuerzel = optional.kuerzel || '';
    copy.regionTyp = optional.typ || '';

    copy.version = optional.version || null;

    return copy;
  }
}
