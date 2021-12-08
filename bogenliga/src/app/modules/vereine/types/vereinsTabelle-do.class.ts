import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class VereinTabelleDO implements VersionedDataObject {

  // gets used in Vereins-Reiter to show the Mannschafts-Infos
  constructor(veranstaltungName: string, wettkampfTag: string, mannschaftsName: string, wettkampfOrtsname: string) {
    this.veranstaltungName = veranstaltungName;
    this.wettkampfTag = wettkampfTag;
    this.wettkampfOrtsname = wettkampfOrtsname;
    this.mannschaftsName = mannschaftsName;
    this.id = 1;
    this.version = 1;
  }

  id: number;
  version: number;

  veranstaltungName: string;
  wettkampfTag: string;
  wettkampfStrasse: string;
  wettkampfPlz: string;
  wettkampfOrtsname: string;
  wettkampfOrtsinfo: string;
  mannschaftsName: string;

}
