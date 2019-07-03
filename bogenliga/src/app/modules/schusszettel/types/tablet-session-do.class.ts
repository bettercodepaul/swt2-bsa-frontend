import {DataObject} from '@shared/data-provider';

export class TabletSessionDO implements DataObject {

  scheibenNr: number;
  wettkampfID: number;
  satzNr: number;
  matchID: number;
  isActive: boolean;

  constructor(scheibenNr?: number,
              wettkampfID?: number,
              satzNr?: number,
              matchID?: number) {
    this.scheibenNr = !!scheibenNr ? scheibenNr : null;
    this.wettkampfID = !!wettkampfID ? wettkampfID : null;
    this.satzNr = !!satzNr ? satzNr : null;
    this.matchID = !!matchID ? matchID : null;
  }
}


