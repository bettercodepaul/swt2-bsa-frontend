import {DataTransferObject} from '@shared/data-provider';

export class TabletSessionDTO implements DataTransferObject {

  scheibennummer: number;
  wettkampfId: number;
  active: boolean;
  satznummer: number;
  matchId: number;
  otherMatchID: number;

  constructor(scheibennummer?: number,
    wettkampfId?: number,
    active?: boolean,
    satznummer?: number,
    matchId?: number,
    otherMatchID?: number) {
    this.scheibennummer = !!scheibennummer ? scheibennummer : null;
    this.wettkampfId = !!wettkampfId ? wettkampfId : null;
    this.active = !!active;
    this.satznummer = !!satznummer ? satznummer : null;
    this.matchId = !!matchId ? matchId : null;
    this.otherMatchID = !!otherMatchID ? otherMatchID : null;
  }
}


