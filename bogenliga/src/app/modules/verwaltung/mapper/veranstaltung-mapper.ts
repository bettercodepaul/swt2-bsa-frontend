import {VersionedDataTransferObject} from '../../shared/data-provider';
import {VeranstaltungDTO} from '@verwaltung/types/datatransfer/veranstaltung-dto.class';


export function fromPayload(payload: VersionedDataTransferObject): VeranstaltungDTO {
  return VeranstaltungDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): VeranstaltungDTO[] {
  const list: VeranstaltungDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}
