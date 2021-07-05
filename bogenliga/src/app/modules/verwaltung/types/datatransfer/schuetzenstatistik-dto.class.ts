import {DataTransferObject} from '@shared/data-provider';

export class SchuetzenstatistikDTO implements DataTransferObject {
  id: number;
  version: number;
  mannschaftsId: number;
  dsbMitgliedId: number;
  dsbMitgliedName: string;
  mannschaftNummer: number;
  matchId: number;
  pfeilpunkteSchnitt: number;
  veranstaltungId: number;
  veranstaltungName: string;
  vereinId: number;
  vereinName: string;
  wettkampfId: number;
  wettkampfTag: number;

  constructor(id: number,
              version: number,
              mannschaftsId: number,
              dsbMitgliedId: number,
              dsbMitgliedName: string,
              mannschaftNummer: number,
              matchId: number,
              pfeilpunkteSchnitt: number,
              veranstaltungId: number,
              veranstaltungName: string,
              vereinId: number,
              vereinName: string,
              wettkampfId: number,
              wettkampfTag: number) {
    this.id = id;
    this.version = version;
    this.mannschaftsId = mannschaftsId;
    this.dsbMitgliedId = dsbMitgliedId;
    this.dsbMitgliedName = dsbMitgliedName;
    this.mannschaftNummer = mannschaftNummer;
    this.matchId = matchId;
    this.pfeilpunkteSchnitt = pfeilpunkteSchnitt;
    this.veranstaltungId = veranstaltungId;
    this.veranstaltungName = veranstaltungName;
    this.vereinId = vereinId;
    this.vereinName = vereinName;
    this.wettkampfId = wettkampfId;
    this.wettkampfTag = wettkampfTag;
  }

  static copyFrom(optional: {
    id?: number;
    version?: number;
    mannschaftsId?: number;
    dsbMitgliedId?: number;
    dsbMitgliedName?: string;
    mannschaftNummer?: number;
    matchId?: number;
    pfeilpunkteSchnitt?: number;
    veranstaltungId?: number;
    veranstaltungName?: string;
    vereinId?: number;
    vereinName?: string;
    wettkampfId?: number;
    wettkampfTag?: number; }
  ): SchuetzenstatistikDTO {
    return new SchuetzenstatistikDTO(
      optional.id || null,
      optional.version || null,
      optional.mannschaftsId || null,
      optional.dsbMitgliedId || null,
      optional.dsbMitgliedName || null,
      optional.mannschaftNummer || null,
      optional.matchId || null,
      optional.pfeilpunkteSchnitt || null,
      optional.veranstaltungId || null,
      optional.veranstaltungName || null,
      optional.vereinId || null,
      optional.vereinName || null,
      optional.wettkampfId || null,
      optional.wettkampfTag || null);
  }
}
