import {LigaDTO} from '../types/datatransfer/liga-dto.class';
import {VersionedDataTransferObject} from '../../shared/data-provider';


export function fromPayload(payload: VersionedDataTransferObject): LigaDTO {
  return LigaDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): LigaDTO[] {
  const list: LigaDTO[] = [];
  payload.forEach(single => list.push(fromPayload(single)));
  return list;
}
