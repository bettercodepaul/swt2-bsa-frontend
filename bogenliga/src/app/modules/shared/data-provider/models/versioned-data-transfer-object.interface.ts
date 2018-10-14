import {DataTransferObject} from './data-transfer-object.interface';

export interface VersionedDataTransferObject extends DataTransferObject {
  id: number;
  version: number;
}
