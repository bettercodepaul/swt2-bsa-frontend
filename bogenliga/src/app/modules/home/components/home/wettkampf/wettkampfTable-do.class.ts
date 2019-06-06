import {DataObject} from '@shared/data-provider/models/data-object.interface';

export class WettkampfTableDo implements DataObject {

  // gets used in Wettkampf Table to show the Wettkampf Information
  constructor(wettkampfTag: string, wettkampfUhrzeit: string, wettkampfLiga: string, wettkampfOrt: string) {
    this.wettkampfTag = wettkampfTag;
    this.wettkampfUhrzeit = wettkampfUhrzeit;
    this.wettkampfLiga = wettkampfLiga;
    this.wettkampfOrt = wettkampfOrt;

  }

  wettkampfTag: string;
  wettkampfUhrzeit: string;
  wettkampfLiga: string;
  wettkampfOrt: string;

}
