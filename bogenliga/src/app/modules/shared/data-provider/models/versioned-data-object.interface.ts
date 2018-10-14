import {DataObject} from './data-object.interface';

export interface VersionedDataObject extends DataObject {
  id: number;
  version: number;
}
