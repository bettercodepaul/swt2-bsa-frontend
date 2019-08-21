import {VersionedDataTransferObject} from '../../shared/data-provider';
import {MatchDTO} from '@verwaltung/types/datatransfer/match-dto.class';

export function fromPayload(payload: VersionedDataTransferObject): MatchDTO {
  return MatchDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): MatchDTO[] {
  const list: MatchDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}
