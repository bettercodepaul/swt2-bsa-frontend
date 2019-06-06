import {VersionedDataTransferObject} from '../../shared/data-provider';
import {WettkampftypDTO} from '../types/datatransfer/wettkampftyp-dto.class';

export function fromPayload(payload: VersionedDataTransferObject): WettkampftypDTO {
  return WettkampftypDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): WettkampftypDTO[] {
  const list: WettkampftypDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  console.log(list);
  return list;
}
