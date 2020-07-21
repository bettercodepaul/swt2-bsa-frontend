import {VersionedDataTransferObject} from '../../shared/data-provider';
import {DataTransferObject} from '../../shared/data-provider';
import {VeranstaltungDTO} from '../types/datatransfer/veranstaltung-dto.class';
import {SportjahrVeranstaltungDTO} from '@verwaltung/types/datatransfer/sportjahr-veranstaltung-dto';



export function fromPayload(payload: VersionedDataTransferObject): VeranstaltungDTO {
  return VeranstaltungDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): VeranstaltungDTO[] {
  const list: VeranstaltungDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}

export function fromPlayloadArraySp(payload: VersionedDataTransferObject[]): SportjahrVeranstaltungDTO[] {
  const list: SportjahrVeranstaltungDTO[] = [];
  payload.forEach((single) => list.push(fromPayloadSportjahr(single)));
  return list;
}

export function fromPayloadSportjahr(payload: VersionedDataTransferObject): SportjahrVeranstaltungDTO {
  return SportjahrVeranstaltungDTO.copyFrom(payload);
}
