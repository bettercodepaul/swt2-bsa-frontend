import {DataTransferObject} from '@shared/data-provider';

export class SchuetzenstatistikDTO implements DataTransferObject {
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
  schuetzeSatz1: string;
  schuetzeSatz2: string;
  schuetzeSatz3: string;
  schuetzeSatz4: string;
  schuetzeSatz5: string;

  constructor(id: number,
              version: number,
              mannschaftsId: number,
              dsbMitgliedId: number,
              dsbMitgliedName: string,
              mannschaftNummer: number,
              matchId: number,
              matchNr: number,
              pfeilpunkteSchnitt: number,
              rueckenNummer: number,
              veranstaltungId: number,
              veranstaltungName: string,
              vereinId: number,
              vereinName: string,
              wettkampfId: number,
              wettkampfTag: number,
              schuetzeSatz1: string,
              schuetzeSatz2: string,
              schuetzeSatz3: string,
              schuetzeSatz4: string,
              schuetzeSatz5: string
  ) {
    this.id = id;
    this.version = version;
    this.mannschaftsId = mannschaftsId;
    this.dsbMitgliedId = dsbMitgliedId;
    this.dsbMitgliedName = dsbMitgliedName;
    this.mannschaftNummer = mannschaftNummer;
    this.matchId = matchId;
    this.matchNr = matchNr;
    this.rueckenNummer = rueckenNummer;
    this.pfeilpunkteSchnitt = pfeilpunkteSchnitt;
    this.veranstaltungId = veranstaltungId;
    this.veranstaltungName = veranstaltungName;
    this.vereinId = vereinId;
    this.vereinName = vereinName;
    this.wettkampfId = wettkampfId;
    this.wettkampfTag = wettkampfTag;
    this.schuetzeSatz1 = schuetzeSatz1;
    this.schuetzeSatz2 = schuetzeSatz2;
    this.schuetzeSatz3 = schuetzeSatz3;
    this.schuetzeSatz4 = schuetzeSatz4;
    this.schuetzeSatz5 = schuetzeSatz5;
  }

  static copyFrom(optional: {
    id?: number;
    version?: number;
    mannschaftsId?: number;
    dsbMitgliedId?: number;
    dsbMitgliedName?: string;
    mannschaftNummer?: number;
    matchId?: number;
    matchNr?: number;
    rueckenNummer?: number;
    pfeilpunkteSchnitt?: number;
    veranstaltungId?: number;
    veranstaltungName?: string;
    vereinId?: number;
    vereinName?: string;
    wettkampfId?: number;
    wettkampfTag?: number;
    schuetzeSatz1?: string;
    schuetzeSatz2?: string;
    schuetzeSatz3?: string;
    schuetzeSatz4?: string;
    schuetzeSatz5?: string;
  }
  ): SchuetzenstatistikDTO {
    return new SchuetzenstatistikDTO(
      optional.id || null,
      optional.version || null,
      optional.mannschaftsId || null,
      optional.dsbMitgliedId || null,
      optional.dsbMitgliedName || null,
      optional.mannschaftNummer || null,
      optional.matchId || null,
      optional.matchNr || null,
      optional.pfeilpunkteSchnitt || null,
      optional.rueckenNummer || null,
      optional.veranstaltungId || null,
      optional.veranstaltungName || null,
      optional.vereinId || null,
      optional.vereinName || null,
      optional.wettkampfId || null,
      optional.wettkampfTag || null,
      optional.schuetzeSatz1 || null,
      optional.schuetzeSatz2 || null,
      optional.schuetzeSatz3 || null,
      optional.schuetzeSatz4 || null,
      optional.schuetzeSatz5 || null
    );
  }
}
