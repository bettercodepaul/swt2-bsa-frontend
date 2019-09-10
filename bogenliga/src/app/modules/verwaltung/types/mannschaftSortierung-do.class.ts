import {VersionedDataObject} from "@shared/data-provider/models/versioned-data-object.interface";

export class MannschaftSortierungDO implements VersionedDataObject{
  id: number;
  version: number;

  sortierung: number;

  constructor(id?: number, sortierung?: number){
    this.id = id;
    this.sortierung = sortierung;
  }
}
