import {VersionedDataTransferObject} from '../../shared/data-provider';
import {WettkampfDTO} from '@vereine/types/datatransfer/wettkampf-dto.class';

export function fromPayload(payload: VersionedDataTransferObject): WettkampfDTO {
  return WettkampfDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): WettkampfDTO[] {
  const list: WettkampfDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}
