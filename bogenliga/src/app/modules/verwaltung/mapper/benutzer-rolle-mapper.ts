import {BenutzerRolleDTO} from '../types/datatransfer/benutzer-rolle-dto.class';
import {VersionedDataTransferObject} from '../../shared/data-provider';
import {BenutzerDO} from "../types/benutzer-do.class";
import {BenutzerRolleDO} from "../types/benutzer-rolle-do.class";


// export function toDO(benutzerRolleDTO: BenutzerRolleDTO): BenutzerRolleDO {
//
// }
//
// export function toDTO(benutzerRolleDO: BenutzerRolleDO): BenutzerRolleDTO {
//
// }


export function fromPayloadBenutzerRolle(payload: VersionedDataTransferObject): BenutzerRolleDO {

  const benutzerRolleDTO = BenutzerRolleDTO.copyFrom(payload);
  const benutzerRolleDO = new BenutzerRolleDO();
  benutzerRolleDO.id = benutzerRolleDTO.id;
  benutzerRolleDO.version = benutzerRolleDTO.version;

  benutzerRolleDO.email = benutzerRolleDTO.email;
  benutzerRolleDO.roleId = benutzerRolleDTO.roleId;
  benutzerRolleDO.roleName = benutzerRolleDTO.roleName;

  return benutzerRolleDO;
}

export function fromPayloadArrayBenutzerRolle(payload: VersionedDataTransferObject[]): BenutzerRolleDO[] {
  const list: BenutzerRolleDO[] = [];
  payload.forEach(single => list.push(fromPayloadBenutzerRolle(single)));
  return list;
}

