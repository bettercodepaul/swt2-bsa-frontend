import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';

export class WettkampfEinzelErgebnis implements VersionedDataObject {
  id: number;
  version: number;

  matchNr: number;
  wettkampfId: number;
  mannschaftName: string;
  schuetze: number;
  durchschPfeilwert: number;

  constructor(matchNr?: number,
              wettkampfId?: number,
              mannschaftName?: string,
              schuetze?: number,
              durchschPfeilwert?: number) {
    this.matchNr = matchNr;
    this.wettkampfId = wettkampfId;
    this.mannschaftName = mannschaftName;
    this.schuetze = schuetze;
    this.durchschPfeilwert = durchschPfeilwert;



  }
}
