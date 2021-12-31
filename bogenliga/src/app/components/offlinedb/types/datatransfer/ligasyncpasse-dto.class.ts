import {DataTransferObject} from '@shared/data-provider';
import {isNullOrUndefined} from '@shared/functions';

export class LigasyncpasseDtoClass implements DataTransferObject {
  id: number;
  version: number;
  matchId: number;
  mannschaftId: number;
  wettkampfId: number;
  lfdNr: number;
  dsbMitgliedId: number;
  dsbMitgliedName: string;
  rueckennummer: number;
  ringzahl: Array<number>;

  static copyFrom(optional: {
    id?: number,
    version?: number,
    matchId?: number,
    mannschaftId?: number,
    wettkampfId?: number,
    matchNr?: number,
    lfdNr?: number,
    dsbMitgliedId?: number,
    dsbMitgliedName?: string,
    rueckennummer?: number,
    ringzahl?: Array<number>
  } = {}): LigasyncpasseDtoClass {
    const copy = new LigasyncpasseDtoClass();
    copy.id = optional.id || null;
    copy.version = optional.version || null;
    copy.matchId = optional.matchId || null;
    copy.mannschaftId = optional.mannschaftId || null;
    copy.wettkampfId = optional.wettkampfId || null;
    copy.dsbMitgliedId = optional.dsbMitgliedId || null;
    copy.dsbMitgliedName = optional.dsbMitgliedName || null;
    copy.rueckennummer = optional.rueckennummer;
    if (isNullOrUndefined(optional.ringzahl)) {
      copy.ringzahl = null;
    } else {
      copy.ringzahl = [];
      optional.ringzahl.forEach((ring) => {
        copy.ringzahl.push(ring);
      });
    }
    return copy;
  }
}
