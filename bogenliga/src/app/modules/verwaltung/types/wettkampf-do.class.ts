import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';


export class WettkampfDO implements VersionedDataObject {
  id: number;
  wettkampfVeranstaltungsId: number;
  wettkampfDatum: string;
  wettkampfStrasse: string;
  wettkampfPlz: string;
  wettkampfOrtsname: string;
  wettkampfOrtsinfo: string;
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
    wettkampfStrasse?: string,
    wettkampfPlz?: string,
    wettkampfOrtsname?: string,
    wettkampfOrtsinfo?: string,
    wettkampfBeginn?: string,
    wettkampfTag?: number,
    wettkampfDisziplinId?: number,
    wettkampfTypId?: number,
    version?: number,
    wettkampfAusrichter ?: number,
    kampfrichterID ?: number
  ) {
    this.id = !!id ? id : null;
    this.wettkampfVeranstaltungsId = !!wettkampfVeranstaltungsId ? wettkampfVeranstaltungsId : null;
    this.wettkampfDatum = !!wettkampfDatum ? wettkampfDatum : '';
    this.wettkampfStrasse = !!wettkampfStrasse ? wettkampfStrasse : '';
    this.wettkampfPlz = !!wettkampfPlz ? wettkampfPlz : '';
    this.wettkampfOrtsname = !!wettkampfOrtsname ? wettkampfOrtsname : '';
    this.wettkampfOrtsinfo = !!wettkampfOrtsinfo ? wettkampfOrtsinfo : '';
    this.wettkampfBeginn = !!wettkampfBeginn ? wettkampfBeginn : '';
    this.wettkampfTag = !!wettkampfTag ? wettkampfTag : null;
    this.wettkampfDisziplinId = !!wettkampfDisziplinId ? wettkampfDisziplinId : null;
    this.wettkampfTypId = !!wettkampfTypId ? wettkampfTypId : null;
    this.version = !!version ? version : null;
    this.wettkampfAusrichter = !!wettkampfAusrichter ? wettkampfAusrichter : null;
    this.kampfrichterID = !!kampfrichterID ? kampfrichterID : null;
  }

}
