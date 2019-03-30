import {VersionedDataTransferObject} from '../../shared/data-provider';
import {BenutzerDTO} from '../types/datatransfer/benutzer-dto.class';


// export function toDO(benutzerDTO: BenutzerDTO): BenutzerDO {
//
// }
//
// export function toDTO(benutzerDO: BenutzerDO): BenutzerDTO {
//
// }


export function fromPayload(payload: VersionedDataTransferObject): BenutzerDTO {
  return BenutzerDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): BenutzerDTO[] {
  const list: BenutzerDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}

