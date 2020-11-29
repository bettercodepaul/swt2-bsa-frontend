import {DataTransferObject} from '@shared/data-provider';

export interface VersionedDataTransferObject extends DataTransferObject {
  id: number;
  version: number;
}
