import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class MannschaftTabelleDO implements VersionedDataObject {

  constructor(name: string, id: number, sportjahr: number, veranstaltungName: string, ligaId: number) {
    this.name = name;
    this.id = id;
    this.sportjahr = sportjahr;
    this.veranstaltungName = veranstaltungName;
    this.version = 1;
    this.ligaId = ligaId;
  }

  id: number;
  name: string;
  sportjahr: number;
  version: number;
  veranstaltungName: string;
  ligaId: number;
}
