import {VersionedDataTransferObject} from '../../shared/data-provider';
import {MatchDTO} from '@verwaltung/types/datatransfer/match-dto.class';
import {VeranstaltungDTO} from "@verwaltung/types/datatransfer/veranstaltung-dto.class";

export function fromPayload(payload: VersionedDataTransferObject): MatchDTO {
  return MatchDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): MatchDTO[] {
  const list: MatchDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}

export function fromVeranstaltungsPayload(payload: VersionedDataTransferObject): VeranstaltungDTO {
  return VeranstaltungDTO.copyFrom(payload);
}
