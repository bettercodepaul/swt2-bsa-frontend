import {TransferObject} from './transfer-object.interface';

export interface VersionedDataTransferObject extends TransferObject {
  id: number;
  version: number;
}
