import {DataObject} from '@shared/data-provider';

export class PasseDO implements DataObject {
  id: number;

  mannschaftId: number;
  wettkampfId: number;
  matchNr: number;
  lfdnr: number;
  dsbMitgliedNr: number;

  ringzahlPfeil1: number;
  ringzahlPfeil2: number;
  ringzahlPfeil3: number;
  ringzahlPfeil4: number;
  ringzahlPfeil5: number;
  ringzahlPfeil6: number;

  schuetzenNr: number;

  constructor(id?: number,
    mannschaftId?: number,
    wettkampfId?: number,
    matchNr?: number,
    lfdnr?: number,
    dsbMitgliedNr?: number,
    ringzahlPfeil1?: number,
    ringzahlPfeil2?: number,
    ringzahlPfeil3?: number,
    ringzahlPfeil4?: number,
    ringzahlPfeil5?: number,
    ringzahlPfeil6?: number,
    schuetzenNr?: number) {
    this.id = !!id ? id : null;
    this.mannschaftId = !!mannschaftId ? mannschaftId : null;
    this.wettkampfId = !!wettkampfId ? wettkampfId : null;
    this.matchNr = !!matchNr ? matchNr : null;
    this.lfdnr = !!lfdnr ? lfdnr : null;
    this.dsbMitgliedNr = !!dsbMitgliedNr ? dsbMitgliedNr : null;
    this.ringzahlPfeil1 = !!ringzahlPfeil1 ? ringzahlPfeil1 : null;
    this.ringzahlPfeil2 = !!ringzahlPfeil2 ? ringzahlPfeil2 : null;
    this.ringzahlPfeil3 = !!ringzahlPfeil3 ? ringzahlPfeil3 : null;
    this.ringzahlPfeil4 = !!ringzahlPfeil4 ? ringzahlPfeil4 : null;
    this.ringzahlPfeil5 = !!ringzahlPfeil5 ? ringzahlPfeil5 : null;
    this.ringzahlPfeil6 = !!ringzahlPfeil6 ? ringzahlPfeil6 : null;
    this.schuetzenNr = !!schuetzenNr ? schuetzenNr : null;
  }
}


