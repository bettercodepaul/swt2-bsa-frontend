import {VersionedDataObject} from '../../../../shared/data-provider/models/versioned-data-object.interface';

export class PlaygroundVersionedDataObject implements VersionedDataObject {
  id: number;
  version = 0;

  name: string;


  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}
