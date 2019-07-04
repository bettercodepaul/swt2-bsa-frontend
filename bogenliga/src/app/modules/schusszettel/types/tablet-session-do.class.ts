import {DataObject} from '@shared/data-provider';

export class TabletSessionDO implements DataObject {

  scheibenNr: number;
  wettkampfID: number;
  isActive: boolean;
  satzNr: number;
  matchID: number;
  otherMatchID: number;

  constructor(scheibenNr?: number,
    wettkampfID?: number,
    isActive?: boolean,
    satzNr?: number,
    matchID?: number,
    otherMatchID?: number) {
    this.scheibenNr = !!scheibenNr ? scheibenNr : null;
    this.wettkampfID = !!wettkampfID ? wettkampfID : null;
    this.isActive = !!isActive;
    this.satzNr = !!satzNr ? satzNr : null;
    this.matchID = !!matchID ? matchID : null;
    this.otherMatchID = !!otherMatchID ? otherMatchID : null;
  }
}
