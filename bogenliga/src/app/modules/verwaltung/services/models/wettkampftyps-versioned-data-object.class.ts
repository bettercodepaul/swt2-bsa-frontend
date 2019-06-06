import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';

export class WettkampftypsVersionedDataObject implements VersionedDataObject {

  id: number;
  wettkampftypName: string;
  version = 0;


  constructor(id: number, wettkampftypName: string) {
    this.id = id;
    this.wettkampftypName = wettkampftypName;
  }
}
