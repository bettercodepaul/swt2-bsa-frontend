import {DataTransferObject} from '@shared/data-provider';

export class MannschaftSortierungDTO implements DataTransferObject {
  id: number;
  version: number;

  sortierung: number;

  static copyFrom(optional: {
    id?: number,
    version?: number,
    sortierung?: number
  } = {}): MannschaftSortierungDTO {
    const copy = new MannschaftSortierungDTO();
    copy.id = optional.id || null;
    copy.version = optional.version || null;
    copy.sortierung = optional.sortierung || null;

    return copy;
  }
}
