import {DataTransferObject} from '@shared/data-provider';

export class PasseDTO implements DataTransferObject {
  id: number;

  mannschaftId: number;
  wettkampfId: number;
  matchNr: number;
  lfdnr: number;
  dsbMitgliedNr: number;

  ringzahl: Array<number>;
  schuetzenNr: number;

  constructor(id?: number,
    mannschaftId?: number,
    wettkampfId?: number,
    matchNr?: number,
    lfdnr?: number,
    dsbMitgliedNr?: number,
    ringzahl?: Array<number>,
    schuetzenNr?: number) {
    this.id = !!id ? id : null;
    this.mannschaftId = !!mannschaftId ? mannschaftId : null;
    this.wettkampfId = !!wettkampfId ? wettkampfId : null;
    this.matchNr = !!matchNr ? matchNr : null;
    this.lfdnr = !!lfdnr ? lfdnr : null;
    this.dsbMitgliedNr = !!dsbMitgliedNr ? dsbMitgliedNr : null;
    this.ringzahl = !!ringzahl ? ringzahl : [];
    this.schuetzenNr = !!schuetzenNr ? schuetzenNr : null;
  }
}
