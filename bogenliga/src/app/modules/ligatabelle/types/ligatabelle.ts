import {Time} from '@angular/common';
import {TransferObject} from '../../shared/data-provider/models/transfer-object.interface';

export class Ligatabelle implements TransferObject {
  id: number;
  veranstaltung_id: number;
  datum: Date;
  ort: string;
  beginn: Time;
  wettkampf_tag: number;
  disziplin_id: number;

  constructor(id: number, veranstaltung_id: number, datum: Date, ort: string, beginn: Time, wettkampf_tag: number, disziplin_id: number) {
    this.id = id;
    this.veranstaltung_id = veranstaltung_id;
    this.datum = datum;
    this.ort = ort;
    this.beginn = beginn;
    this.wettkampf_tag = wettkampf_tag;
    this.disziplin_id = disziplin_id;
  }
}

