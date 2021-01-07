import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';

export class WettkampfEinzelGesamtErgebnis implements VersionedDataObject {
  id: number;
  version: number;

  wettkampfId: number;
  mannschaftName: string;
  schuetze: string;
  durchschPfeilwert: number;


  constructor(wettkampfId?: number,
    mannschaftName?: string,
    schuetze?: string,
    durchschPfeilwert?: number) {

    this.wettkampfId = wettkampfId;
    this.mannschaftName = mannschaftName;
    this.schuetze = schuetze;
    this.durchschPfeilwert = durchschPfeilwert;



  }
}
