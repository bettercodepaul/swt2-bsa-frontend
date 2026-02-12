import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';

export class MannschaftTabelleDO implements VersionedDataObject {

  constructor(name: string, id: number, veranstaltungId: number) {
    this.name = name;
    this.id = id;
    this.version = 1;
    this.veranstaltungId = veranstaltungId;
  }

  id: number;
  name: string;
  version: number;
  veranstaltungId: number;
}
