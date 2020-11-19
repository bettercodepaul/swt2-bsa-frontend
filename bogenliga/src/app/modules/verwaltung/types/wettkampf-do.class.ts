import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';


export class WettkampfDO implements VersionedDataObject {
  id: number;
  wettkampfVeranstaltungsId: number;
  wettkampfDatum: string;
  wettkampfOrt: string;
  wettkampfBeginn: string;
  wettkampfTag: number;
  wettkampfDisziplinId: number;
  wettkampfTypId: number;
  version: number;
  kampfrichterID: number;
  wettkampfAusrichter: number;


  // not set, find Liga by WettkampfId
  wettkampfLiga: string;


  constructor(id?: number,
              wettkampfVeranstaltungsId?: number,
              wettkampfDatum?: string,
              wettkampfOrt?: string,
              wettkampfBeginn?: string,
              wettkampfTag?: number,
              wettkampfDisziplinId?: number,
              wettkampfTypId?: number,
              version?: number,
              kampfrichterID?: number,
              wettkampfAusrichter?: number) {
    this.id = !!id ? id : null;
    this.wettkampfVeranstaltungsId = !!wettkampfVeranstaltungsId ? wettkampfVeranstaltungsId : null;
    this.wettkampfDatum = !!wettkampfDatum ? wettkampfDatum : '';
    this.wettkampfOrt = !!wettkampfOrt ? wettkampfOrt : '';
    this.wettkampfBeginn = !!wettkampfBeginn ? wettkampfBeginn : '';
    this.wettkampfTag = !!wettkampfTag ? wettkampfTag : null;
    this.wettkampfDisziplinId = !!wettkampfDisziplinId ? wettkampfDisziplinId : null;
    this.wettkampfTypId = !!wettkampfTypId ? wettkampfTypId : null;
    this.version = !!version ? version : null;
    this.kampfrichterID = !!kampfrichterID ? kampfrichterID : null;
    this.wettkampfAusrichter = !!wettkampfAusrichter ? wettkampfAusrichter : null;
  }

}
