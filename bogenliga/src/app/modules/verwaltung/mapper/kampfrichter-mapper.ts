import {VersionedDataTransferObject} from '../../shared/data-provider';
import {KampfrichterDTO} from '../types/datatransfer/kampfrichter-dto.class';


export function fromPayload(payload: VersionedDataTransferObject): KampfrichterDTO {
  return KampfrichterDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): KampfrichterDTO[] {
  const list: KampfrichterDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}
