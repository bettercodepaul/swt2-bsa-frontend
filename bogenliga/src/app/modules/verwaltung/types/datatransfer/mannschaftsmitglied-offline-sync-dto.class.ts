import {DataTransferObject} from '@shared/data-provider';

export class MannschaftsmitgliedOfflineSyncDto implements DataTransferObject {
  id: number;
  version: number;
  mannschaftId: number;
  dsbMitgliedId: number;
  dsbMitgliedEingesetzt: number;
  rueckennummer: number;

  static copyFrom(optional: {
    id?: number;
    version?: number;
    mannschaftId?: number;
    dsbMitgliedId?: number;
    dsbMitgliedEingesetzt?: number;
    rueckennummer?: number;

  } = {}): MannschaftsmitgliedOfflineSyncDto {
    const copy = new MannschaftsmitgliedOfflineSyncDto();
    // show '0' value
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }
    copy.id = optional.id || null;
    copy.version = optional.version || null;
    copy.mannschaftId = optional.mannschaftId || null;
    copy.dsbMitgliedId = optional.dsbMitgliedId || null;
    if (optional.dsbMitgliedEingesetzt >= 0) {
      copy.dsbMitgliedEingesetzt = optional.dsbMitgliedEingesetzt;
    } else {
      copy.dsbMitgliedEingesetzt = null;
    }
    copy.rueckennummer = optional.rueckennummer;

    return copy;
  }
}
