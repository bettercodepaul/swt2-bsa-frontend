import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';

/**
 *  MannschaftTabellenverlaufWettkampftage DO Klasse
 */

export class MannschaftTabellenverlaufWettkampftage implements VersionedDataObject {

  constructor(
  ) {
    this.tabellenplatzierung_wettkampftag1 = null;
    this.tabellenplatzierung_wettkampftag2 = null;
    this.tabellenplatzierung_wettkampftag3 = null;
    this.tabellenplatzierung_wettkampftag4 = null;
  }
  id: number;
  version: number;
  tabellenplatzierung_wettkampftag1: string;
  tabellenplatzierung_wettkampftag2: string;
  tabellenplatzierung_wettkampftag3: string;
  tabellenplatzierung_wettkampftag4: string;

}
