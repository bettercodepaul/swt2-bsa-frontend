import { DataTransferObject } from '../../../shared/data-provider';

export class TabletSessionDTO implements DataTransferObject {

  scheibennummer: number;
  wettkampfId: number;
  active: boolean;
  satznummer: number;
  matchId: number;
  otherMatchId: number;
  accessToken: string;

  constructor(scheibennummer?: number,
    wettkampfId?: number,
    active?: boolean,
    satznummer?: number,
    matchId?: number,
    otherMatchID?: number,
    accessToken?: string) {
    this.scheibennummer = !!scheibennummer ? scheibennummer : null;
    this.wettkampfId = !!wettkampfId ? wettkampfId : null;
    this.active = !!active;
    this.satznummer = !!satznummer ? satznummer : null;
    this.matchId = !!matchId ? matchId : null;
    this.otherMatchId = !!otherMatchID ? otherMatchID : null;
    this.accessToken = !!accessToken ? accessToken : null;
  }
}
