import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class MannschaftTabelleDO implements VersionedDataObject {

  constructor(name: string, id: number, liga: string) {
    this.name = name;
    this.id = id;
    this.liga = liga
    this.version = 1;
  }

  id: number;
  liga: string;
  name: string;
  version: number;
}
