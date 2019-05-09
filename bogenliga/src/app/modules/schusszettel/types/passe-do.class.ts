import {DataObject} from '@shared/data-provider';

export class PasseDO implements DataObject {
  id: number;

  matchId: number;
  mannschaftId: number;
  wettkampfId: number;
  matchNr: number;
  lfdNr: number;
  dsbMitgliedId: number;

  ringzahlPfeil1: number;
  ringzahlPfeil2: number;
  ringzahlPfeil3: number;
  ringzahlPfeil4: number;
  ringzahlPfeil5: number;
  ringzahlPfeil6: number;

  schuetzeNr: number;

  constructor(id?: number,
    matchId?: number,
    mannschaftId?: number,
    wettkampfId?: number,
    matchNr?: number,
    lfdNr?: number,
    dsbMitgliedId?: number,
    ringzahlPfeil1?: number,
    ringzahlPfeil2?: number,
    ringzahlPfeil3?: number,
    ringzahlPfeil4?: number,
    ringzahlPfeil5?: number,
    ringzahlPfeil6?: number,
    schuetzeNr?: number) {
    this.id = !!id ? id : null;
    this.matchId = !!matchId ? matchId : null;
    this.mannschaftId = !!mannschaftId ? mannschaftId : null;
    this.wettkampfId = !!wettkampfId ? wettkampfId : null;
    this.matchNr = !!matchNr ? matchNr : null;
    this.lfdNr = !!lfdNr ? lfdNr : null;
    this.dsbMitgliedId = !!dsbMitgliedId ? dsbMitgliedId : null;
    this.ringzahlPfeil1 = !!ringzahlPfeil1 ? ringzahlPfeil1 : null;
    this.ringzahlPfeil2 = !!ringzahlPfeil2 ? ringzahlPfeil2 : null;
    this.ringzahlPfeil3 = !!ringzahlPfeil3 ? ringzahlPfeil3 : null;
    this.ringzahlPfeil4 = !!ringzahlPfeil4 ? ringzahlPfeil4 : null;
    this.ringzahlPfeil5 = !!ringzahlPfeil5 ? ringzahlPfeil5 : null;
    this.ringzahlPfeil6 = !!ringzahlPfeil6 ? ringzahlPfeil6 : null;
    this.schuetzeNr = !!schuetzeNr ? schuetzeNr : null;
  }
}


