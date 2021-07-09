import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';


export class SchuetzenstatistikDO implements VersionedDataObject {
  id: number;
  version: number;
  mannschaftsId: number;
  dsbMitgliedId: number;
  dsbMitgliedName: string;
  mannschaftNummer: number;
  matchId: number;
  matchNr: number;
  pfeilpunkteSchnitt: number;
  rueckenNummer: number;
  veranstaltungId: number;
  veranstaltungName: string;
  vereinId: number;
  vereinName: string;
  wettkampfId: number;
  wettkampfTag: number;


  constructor(
    id?: number,
    version?: number,
    mannschaftsId?: number,
    dsbMitgliedId?: number,
    dsbMitgliedName?: string,
    mannschaftNummer?: number,
    matchId?: number,
    matchNr?: number,
    pfeilpunkteSchnitt?: number,
    rueckenNummer?: number,
    veranstaltungId?: number,
    veranstaltungName?: string,
    vereinId?: number,
    vereinName?: string,
    wettkampfId?: number,
    wettkampfTag?: number,
  ) {
    this.id = id;
    this.version = version;
    this.mannschaftsId = mannschaftsId;
    this.dsbMitgliedId = dsbMitgliedId;
    this.dsbMitgliedName = dsbMitgliedName;
    this.mannschaftNummer = mannschaftNummer;
    this.matchId = matchId;
    this.matchNr = matchNr;
    this.pfeilpunkteSchnitt = pfeilpunkteSchnitt;
    this.rueckenNummer = rueckenNummer;
    this.veranstaltungId = veranstaltungId;
    this.veranstaltungName = veranstaltungName;
    this.vereinId = vereinId;
    this.vereinName = vereinName;
    this.wettkampfId = wettkampfId;
    this.wettkampfTag = wettkampfTag;
  }
}
