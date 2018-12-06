import {DataTransferObject} from '../../../shared/data-provider';

export class WettkampfKlasseDTO implements DataTransferObject {
  id: number;
  klasseName: string;
  klasseJahrgangMin: number;
  klasseJahrgangMax: number;
  klasseNr: number;
  version: number;

  static copyFrom(optional: {
    id?: number,
    klasseName?: string,
    klasseJahrgangMin?: number,
    klasseJahrgangMax?: number,
    klasseNr?: number,
    version?: number
  } = {}): WettkampfKlasseDTO {
    const copy = new WettkampfKlasseDTO();

    // show '0' value
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }

    copy.klasseName = optional.klasseName || '';
    copy.klasseJahrgangMin = optional.klasseJahrgangMin || null;
    copy.klasseJahrgangMax = optional.klasseJahrgangMax || null;
    copy.klasseNr = optional.klasseNr || null;

    copy.version = optional.version || null;

    return copy;
  }
}
