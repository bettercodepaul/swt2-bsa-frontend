import {DataTransferObject} from '@shared/data-provider';

export class LigatabelleOfflineSyncDto implements DataTransferObject {

  veranstaltungId: number;
  veranstaltungName: string;
  wettkampfId: number;
  wettkampfTag: number;
  mannschaftId: number;
  mannschaftName: string;
  matchpkt: number;
  matchpktGegen: number;
  satzpkt: number;
  satzpktGegen: number;
  satzpktDifferenz: number;
  sortierung: number;
  tabellenplatz: number;

  static copyFrom(optional: {
    veranstaltungId?: number,
    veranstaltungName?: string,
    wettkampfId?: number,
    wettkampfTag?: number,
    mannschaftId?: number,
    mannschaftName?: string,
    matchpkt?: number,
    matchpktGegen?: number,
    satzpkt?: number,
    satzpktGegen?: number,
    satzpktDifferenz?: number,
    sortierung?: number,
    tabellenplatz?: number,
  } = {}): LigatabelleOfflineSyncDto {
    const copy = new LigatabelleOfflineSyncDto();
    copy.veranstaltungId = optional.veranstaltungId ;
    copy.veranstaltungName = optional.veranstaltungName ;
    copy.wettkampfId = optional.wettkampfId;
    copy.wettkampfTag = optional.wettkampfTag;
    copy.mannschaftId = optional.mannschaftId;
    copy.mannschaftName = optional.mannschaftName;
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
