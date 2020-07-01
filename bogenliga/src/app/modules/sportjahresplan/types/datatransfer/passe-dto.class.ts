import {DataTransferObject} from '../../../shared/data-provider';

export class PasseDTO implements DataTransferObject {
  id: number;

  matchId: number;
  mannschaftId: number;
  wettkampfId: number;
  matchNr: number;
  lfdNr: number;
  dsbMitgliedId: number;

  ringzahl: Array<number>;
  rueckennummer: number;

  constructor(id?: number,
              matchId?: number,
              mannschaftId?: number,
              wettkampfId?: number,
              matchNr?: number,
              lfdNr?: number,
              dsbMitgliedId?: number,
              ringzahl?: Array<number>,
              rueckennummer?: number) {
    this.id = !!id ? id : null;
    this.matchId = !!matchId ? matchId : null;
    this.mannschaftId = !!mannschaftId ? mannschaftId : null;
    this.wettkampfId = !!wettkampfId ? wettkampfId : null;
    this.matchNr = !!matchNr ? matchNr : null;
    this.lfdNr = !!lfdNr ? lfdNr : null;
    this.dsbMitgliedId = !!dsbMitgliedId ? dsbMitgliedId : null;
    this.ringzahl = !!ringzahl ? ringzahl : [];
    this.rueckennummer = !!rueckennummer ? rueckennummer : null;
  }
}
