import {DataTransferObject} from '@shared/data-provider';
import {isNullOrUndefined} from '@shared/functions';

export class PasseDTOClass implements DataTransferObject {
  id: number;
  version: number;

  matchId: number;
  mannschaftId: number;
  wettkampfId: number;
  matchNr: number;
  lfdNr: number;
  dsbMitgliedId: number;

  ringzahl: Array<number>;
  schuetzeNr: number;

  static copyFrom(optional: {
    id?: number,
    version?: number,
    matchId?: number,
    mannschaftId?: number,
    wettkampfId?: number,
    matchNr?: number,
    lfdNr?: number,
    dsbMitgliedId?: number,
    schuetzeNr?: number,
    ringzahl?: Array<number>
  } = {}): PasseDTOClass {
    const copy = new PasseDTOClass();

    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }

    if (optional.dsbMitgliedId >= 0) {
      copy.dsbMitgliedId = optional.dsbMitgliedId;
    } else {
      copy.dsbMitgliedId = null;
    }

    if (optional.wettkampfId >= 0) {
      copy.wettkampfId = optional.wettkampfId;
    } else {
      copy.wettkampfId = null;
    }
    if (optional.mannschaftId >= 0) {
      copy.mannschaftId = optional.mannschaftId;
    } else {
      copy.mannschaftId = null;
    }
    if (optional.lfdNr >= 0) {
      copy.lfdNr = optional.lfdNr;
    } else {
      copy.lfdNr = null;
    }
    if (optional.matchId >= 0) {
      copy.matchId = optional.matchId;
    } else {
      copy.matchId = null;
    }
    if (optional.schuetzeNr >= 0) {
      copy.schuetzeNr = optional.schuetzeNr;
    } else {
      copy.schuetzeNr = null;
    }
    if (optional.version >= 0) {
      copy.version = optional.version;
    } else {
      copy.version = null;
    }

    if (optional.matchNr >= 0) {
      copy.matchNr = optional.matchNr;
    } else {
      copy.matchNr = null;
    }

    if (isNullOrUndefined(optional.ringzahl)) {
      copy.ringzahl = null;
    } else {
      copy.ringzahl = new Array();
      optional.ringzahl.forEach((ring) => {
        copy.ringzahl.push(ring);
      });
    }

    return copy;
  }
}
