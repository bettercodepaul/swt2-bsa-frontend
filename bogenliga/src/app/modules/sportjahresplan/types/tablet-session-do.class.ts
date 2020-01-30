import { DataObject } from '../../shared/data-provider';

export class TabletSessionDO implements DataObject {

  scheibenNr: number;
  wettkampfID: number;
  isActive: boolean;
  satzNr: number;
  matchID: number;
  otherMatchId: number;
  accessToken: string;

  constructor(scheibenNr?: number,
              wettkampfID?: number,
              isActive?: boolean,
              satzNr?: number,
              matchID?: number,
              otherMatchID?: number,
              accessToken?: string) {
    this.scheibenNr = !!scheibenNr ? scheibenNr : null;
    this.wettkampfID = !!wettkampfID ? wettkampfID : null;
    this.isActive = !!isActive;
    this.satzNr = !!satzNr ? satzNr : null;
    this.matchID = !!matchID ? matchID : null;
    this.otherMatchId = !!otherMatchID ? otherMatchID : null;
    this.accessToken = accessToken ? accessToken : null;
  }
}
