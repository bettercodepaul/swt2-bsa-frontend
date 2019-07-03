import {DataTransferObject} from '@shared/data-provider';

export class TabletSessionDTO implements DataTransferObject {

  scheibenNr: number;
  wettkampfID: number;
  satzNr: number;
  matchID: number;

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


