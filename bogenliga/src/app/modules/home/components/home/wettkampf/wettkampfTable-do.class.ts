import {DataObject} from '@shared/data-provider/models/data-object.interface';

export class WettkampfTableDo implements DataObject {

  // gets used in Ligatabelle Table to show the Ligatabelle Information
  constructor(wettkampfTag: string, wettkampfUhrzeit: string, wettkampfLiga: string, wettkampfOrt: string, wettkampfStrasse: string, wettkampfPlz: string, wettkampfOrtsname: string, wettkampfOrtsinfo: string) {
    this.wettkampfTag = wettkampfTag;
    this.wettkampfUhrzeit = wettkampfUhrzeit;
    this.wettkampfLiga = wettkampfLiga;
    this.wettkampfOrt = wettkampfOrt;
    this.wettkampfStrasse = wettkampfStrasse;
    this.wettkampfPlz = wettkampfPlz;
    this.wettkampfOrtsname = wettkampfOrtsname;
    this.wettkampfOrtsinfo = wettkampfOrtsinfo;

  }

  wettkampfTag: string;
  wettkampfUhrzeit: string;
  wettkampfLiga: string;
  wettkampfOrt: string;
  wettkampfStrasse: string;
  wettkampfPlz: string;
  wettkampfOrtsname: string;
  wettkampfOrtsinfo: string;


}
