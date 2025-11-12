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
  wettkampfAusrichter: number;


  // not set, find Liga by WettkampfId
  wettkampfLiga: string;



  constructor(
    id?: number,
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
    wettkampfAusrichter ?: number
  ) {
    this.id = !!id ? id : null;
    this.wettkampfVeranstaltungsId =  wettkampfVeranstaltungsId !== undefined && wettkampfVeranstaltungsId !== null ? wettkampfVeranstaltungsId : null;
    this.wettkampfDatum =  wettkampfDatum !== undefined && wettkampfDatum !== null ? wettkampfDatum : '';
    this.wettkampfStrasse =  wettkampfStrasse !== undefined && wettkampfStrasse !== null ? wettkampfStrasse : '';
    this.wettkampfPlz = wettkampfPlz !== undefined && wettkampfPlz !== null ? wettkampfPlz : '';
    this.wettkampfOrtsname = wettkampfOrtsname !== undefined && wettkampfOrtsname !== null ? wettkampfOrtsname : '';
    this.wettkampfOrtsinfo = wettkampfOrtsinfo !== undefined && wettkampfOrtsinfo !== null ? wettkampfOrtsinfo : '';
    this.wettkampfBeginn = wettkampfBeginn !== undefined && wettkampfBeginn !== null ? wettkampfBeginn : '';
    this.wettkampfTag = wettkampfTag !== undefined && wettkampfTag !== null ? wettkampfTag : null;
    this.wettkampfDisziplinId = wettkampfDisziplinId !== undefined && wettkampfDisziplinId !== null ? wettkampfDisziplinId : null;
    this.wettkampfTypId = wettkampfTypId !== undefined && wettkampfTypId !== null ? wettkampfTypId : null;
    this.version =  version !== undefined && version !== null ? version : null;
    this.wettkampfAusrichter = wettkampfAusrichter !== undefined && wettkampfAusrichter !== null ? wettkampfAusrichter : null;
  }

  isComplete(): boolean {
    return (
      this.id !== null &&
      this.wettkampfVeranstaltungsId !== null &&
      this.wettkampfDatum !== null &&
      this.wettkampfStrasse !== null &&
      this.wettkampfPlz !== null &&
      this.wettkampfOrtsname !== null &&
      this.wettkampfOrtsinfo !== null &&
      this.wettkampfBeginn !== null &&
      this.wettkampfTag !== null &&
      this.wettkampfDisziplinId !== null &&
      this.wettkampfTypId !== null &&
      this.version !== null &&
      this.wettkampfAusrichter !== null
    );
  }


}
