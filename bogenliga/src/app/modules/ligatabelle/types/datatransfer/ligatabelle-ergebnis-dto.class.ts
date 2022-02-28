
import {DataTransferObject} from '@shared/data-provider';

export class LigatabelleErgebnisDTO implements DataTransferObject {
  id: number;
  version: number;

  veranstaltungId: number;
  veranstaltungName: string;
  wettkampfId: number;
  wettkampfTag: number;
  mannschaftId: number;
  mannschaftNummer: number;
  vereinId: number;
  vereinName: string;
  matchpkt: number;
  matchpktGegen: number;
  satzpkt: number;
  satzpktGegen: number;
  satzpktDifferenz: number;
  sortierung: number;
  tabellenplatz: number;

  static copyFrom(optional: {
    id?: number,
    version?: number,
    veranstaltungId?: number,
    veranstaltungName?: string,
    wettkampfId?: number,
    wettkampfTag?: number,
    mannschaftId?: number,
    mannschaftNummer?: number,
    vereinId?: number,
    vereinName?: string
    matchpkt?: number,
    matchpktGegen?: number,
    satzpkt?: number,
    satzpktGegen?: number,
    satzpktDifferenz?: number,
    sortierung?: number,
    tabellenplatz?: number
  } = {}): LigatabelleErgebnisDTO {
    const copy = new LigatabelleErgebnisDTO();
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }
    copy.version = optional.version || 1;

    copy.veranstaltungId = optional.veranstaltungId;
    copy.veranstaltungName = optional.veranstaltungName || '';
    copy.wettkampfId = optional.wettkampfId;
    copy.wettkampfTag = optional.wettkampfTag;
    copy.mannschaftId = optional.mannschaftId;
    copy.mannschaftNummer = optional.mannschaftNummer;
    copy.vereinId = optional.vereinId;
    copy.vereinName = optional.vereinName || '';
    copy.matchpkt = optional.matchpkt;
    copy.matchpktGegen = optional.matchpktGegen;
    copy.satzpkt = optional.satzpkt;
    copy.satzpktGegen = optional.satzpktGegen;
    copy.satzpktDifferenz = optional.satzpktDifferenz;
    copy.sortierung = optional.sortierung;
    copy.tabellenplatz = optional.tabellenplatz;

    return copy;
  }
}
