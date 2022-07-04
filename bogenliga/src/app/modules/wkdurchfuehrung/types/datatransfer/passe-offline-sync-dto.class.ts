import {DataTransferObject} from '@shared/data-provider';

export class PasseOfflineSyncDtoClass implements DataTransferObject {
  id: number;
  version: number;
  matchId: number;
  mannschaftId: number;
  wettkampfId: number;
  matchNr: number;
  lfdNr: number;
  dsbMitgliedId: number;
  // Rinzahl as an array instead of the 6 Columns
  ringzahl: Array <number>;
  rueckennummer: number;

  static copyFrom(optional: {
    id?: number,
    version?: number,
    matchId?: number,
    mannschaftId?: number,
    wettkampfId?: number,
    matchNr?: number,
    lfdNr?: number,
    dsbMitgliedId?: number,
    ringzahl?: Array <number>,

    rueckennummer?: number,
  } = {}): PasseOfflineSyncDtoClass {
    const copy = new PasseOfflineSyncDtoClass();
    copy.id = optional.id ? optional.id : null;
    copy.version = optional.version ? optional.version : 1;
    copy.matchId = optional.matchId ? optional.matchId : null;
    copy.mannschaftId = optional.mannschaftId ? optional.mannschaftId : null;
    copy.wettkampfId = optional.wettkampfId ? optional.wettkampfId : null;
    copy.matchNr = optional.matchNr ? optional.matchNr : null;
    copy.lfdNr = optional.lfdNr ? optional.lfdNr : null;
    copy.dsbMitgliedId = optional.dsbMitgliedId ? optional.dsbMitgliedId : null;
    copy.ringzahl = optional.ringzahl ? optional.ringzahl : [];
    copy.rueckennummer = optional.rueckennummer ? optional.rueckennummer : null;
    return copy;
  }
}
