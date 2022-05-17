import {VersionedDataTransferObject} from '../../shared/data-provider';
import {UserDO} from '../types/user-do.class';
import {UserRolleDO} from '../types/user-rolle-do.class';
import {UserRolleDTO} from '../types/datatransfer/user-rolle-dto.class';


// export function toDO(userRolleDTO: UserRolleDTO): UserRolleDO {
//
// }
//
// export function toDTO(userRolleDO: UserRolleDO): UserRolleDTO {
//
// }


export function fromPayloadUserRolle(payload: VersionedDataTransferObject): UserRolleDO {

  const userRolleDTO = UserRolleDTO.copyFrom(payload);
  const userRolleDO = new UserRolleDO();
  userRolleDO.id = userRolleDTO.id;
  userRolleDO.version = userRolleDTO.version;

  userRolleDO.email = userRolleDTO.email;
  userRolleDO.roleId = userRolleDTO.roleId;
  userRolleDO.roleName = userRolleDTO.roleName;
  userRolleDO.active = userRolleDTO.active;
  userRolleDO.dsbMitgliedNachname = userRolleDTO.dsbMitgliedNachname;
  userRolleDO.dsbMitgliedVorname = userRolleDTO.dsbMitgliedVorname;

  return userRolleDO;
}

export function fromPayloadArrayUserRolle(payload: VersionedDataTransferObject[]): UserRolleDO[] {
  const list: UserRolleDO[] = [];
  payload.forEach((single) => list.push(fromPayloadUserRolle(single)));
  return list;
}

