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
    wettkampfTag?: number;

  } = {}): SchuetzenstatistikDTO {
    const copy = new SchuetzenstatistikDTO();
    // show '0' value
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }
    copy.id = optional.id || null;
    copy.version = optional.version || null;
    copy.mannschaftsId = optional.mannschaftsId || null;
    copy.dsbMitgliedId = optional.dsbMitgliedId || null;
    copy.dsbMitgliedName = optional.dsbMitgliedName || null;
    copy.mannschaftNummer = optional.mannschaftNummer || null;
    copy.matchId = optional.matchId || null;
    copy.veranstaltungId = optional.veranstaltungId || null;
    copy.veranstaltungName = optional.veranstaltungName || null;
    copy.vereinId = optional.vereinId || null;
    copy.vereinName = optional.vereinName || null;
    copy.wettkampfId = optional.wettkampfId || null;
    copy.wettkampfTag = optional.wettkampfTag || null;

    return copy;
  }
}
