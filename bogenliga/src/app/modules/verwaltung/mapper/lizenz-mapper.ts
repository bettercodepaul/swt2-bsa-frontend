import {VersionedDataTransferObject} from '../../shared/data-provider';
import {LizenzDTO} from '@verwaltung/types/datatransfer/lizenz-dto.class';


export function fromPayload(payload: VersionedDataTransferObject): LizenzDTO {
  console.log(payload);
  return LizenzDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): LizenzDTO[] {
  const list: LizenzDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}
