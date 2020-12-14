import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class VereinTabelleDO implements VersionedDataObject {

  // gets used in Vereins-Reiter to show the Mannschafts-Infos
  constructor(veranstaltung_name: string, wettkampfTag: string, wettkampfOrt: string, mannschaftsName: string) {
    this.veranstaltung_name = veranstaltung_name;
    this.wettkampfTag = wettkampfTag;
    this.wettkampfOrt = wettkampfOrt;
    this.mannschaftsName = mannschaftsName;
    this.id = 1;
    this.version = 1;
  }

  id: number;
  version: number;

  veranstaltung_name: string;
  wettkampfTag: string;
  wettkampfOrt: string;
  wettkampfStrasse: string;
  wettkampfPlz: string;
  wettkampfOrtsname: string;
  wettkampfOrtsinfo: string;
  mannschaftsName: string;

}
