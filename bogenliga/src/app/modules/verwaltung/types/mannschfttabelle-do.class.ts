import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';

export class MannschaftTabelleDO implements VersionedDataObject {

  constructor(name: string, id: number, veranstaltungName: string, ligaId: number) {
    this.name = name;
    this.id = id;
    this.version = 1;
    this.veranstaltungName = veranstaltungName;
    this.ligaId = ligaId;
  }

  id: number;
  name: string;
  version: number;
  veranstaltungName: string;
  ligaId: number;
}
