import {VersionedDataTransferObject} from '../../shared/data-provider';
import {UserDTO} from '../types/datatransfer/user-dto.class';


// export function toDO(userDTO: UserDTO): UserDO {
//
// }
//
// export function toDTO(userDO: UserDO): UserDTO {
//
// }


export function fromPayload(payload: VersionedDataTransferObject): UserDTO {
  return UserDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): UserDTO[] {
  const list: UserDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}

