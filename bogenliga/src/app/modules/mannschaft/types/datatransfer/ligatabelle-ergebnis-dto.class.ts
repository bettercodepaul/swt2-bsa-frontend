import {DataTransferObject} from '@shared/data-provider';

export class LigatabelleErgebnisDTO implements DataTransferObject {
  id: number;
  version: number;

  veranstaltung_id: number;
  wettkampf_tag: number;
  mannschaft_id: number;
  mannschaft_nummer: number;
  tabellenplatz: number;
  matchpkt: number;
  matchpkt_gegen: number;
  satzpkt: number;
  satzpkt_gegen: number;
  verein_id: number;
  verein_name: string;

  static copyFrom(optional: {
    id?: number,
    version?: number,
    veranstaltung_id?: number,
    wettkampf_tag?: number,
    mannschaft_id?: number,
    mannschaft_nummer?: number,
    tabellenplatz?: number,
    matchpkt?: number,
    matchpkt_gegen?: number,
    satzpkt?: number,
    satzpkt_gegen?: number,
    verein_id?: number,
    verein_name?: string


  } = {}): LigatabelleErgebnisDTO {
    const copy = new LigatabelleErgebnisDTO();
    if (optional.id >= 0) {
      copy.id = optional.id;
    } else {
      copy.id = null;
    }
    //TODO
    copy.version = optional.version || null;

    copy.veranstaltung_id = optional.veranstaltung_id || null;
    copy.wettkampf_tag = optional.wettkampf_tag || null;
    copy.mannschaft_nummer = optional.mannschaft_nummer || null;
    copy.tabellenplatz = optional.tabellenplatz || null;
    copy.matchpkt = optional.matchpkt || null;
    copy.matchpkt_gegen = optional.matchpkt_gegen || null;
    copy.satzpkt = optional.satzpkt || null;
    copy.satzpkt_gegen = optional.satzpkt_gegen || null;
    copy.verein_id = optional.verein_id || null;
    copy.verein_name = optional.verein_name || '';

    return copy;
  }
}
