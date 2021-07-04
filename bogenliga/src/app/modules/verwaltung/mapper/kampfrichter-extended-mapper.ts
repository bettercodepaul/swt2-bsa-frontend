import {VersionedDataTransferObject} from '@shared/data-provider';
import {kampfrichterExtendedDTO} from '../types/datatransfer/kampfrichter-extended-dto.class';


export function fromPayloadExtended(payload: VersionedDataTransferObject): kampfrichterExtendedDTO {
  return kampfrichterExtendedDTO.copyFrom(payload);
}

export function fromPayloadArrayExtended(payload: VersionedDataTransferObject[]): kampfrichterExtendedDTO[] {
  const list: kampfrichterExtendedDTO[] = [];
  payload.forEach((single) => list.push(fromPayloadExtended(single)));
  return list;
}
