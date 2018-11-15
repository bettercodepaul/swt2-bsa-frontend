import {DataTransferObject} from '../../../shared/data-provider';

export class WettkampfKlasseDTO implements DataTransferObject {
  id: number;
  klasseName: string;
  klasseAlterMin: number;
  klasseAlterMax: number;
  klasseNr: number;
  version: number;

  static copyFrom(optional: {
    id?: number,
    klasseName?: string,
    klasseAlterMin?: number,
    klasseAlterMax?: number,
    klasseNr?: number,
    version?: number
  } = {}): WettkampfKlasseDTO {
    const copy = new WettkampfKlasseDTO();
    copy.id = optional.id || null;
    copy.klasseName = optional.klasseName || '';
    copy.klasseAlterMin = optional.klasseAlterMin || null;
    copy.klasseAlterMax = optional.klasseAlterMax || null;
    copy.klasseNr = optional.klasseNr || null;

    copy.version = optional.version || null;

    return copy;
  }
}
