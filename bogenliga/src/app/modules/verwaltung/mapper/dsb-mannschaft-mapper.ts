import {VersionedDataTransferObject} from '../../shared/data-provider';
import {DsbMannschaftDTO} from '../types/datatransfer/dsb-mannschaft-dto.class';
import {DsbMannschaftVerAndWettDo} from '@verwaltung/types/dsb-mannschaft-ver-and-wett-do';
import {DsbMannschaftVerAndWettDto} from '@verwaltung/types/datatransfer/dsb-mannschaft-ver-and-wett-dto';

// export function toDO(mannschaftDTO: MannschaftDTO): MannschaftDO {
//
// }
//
// export function toDTO(mannschaftDO: MannschaftDO): MannschaftDTO {
//
// }

export function fromPayload(payload: VersionedDataTransferObject): DsbMannschaftDTO {
  return DsbMannschaftDTO.copyFrom(payload);
}
export function fromPayloadVerAndWett(payload: DsbMannschaftVerAndWettDo): DsbMannschaftVerAndWettDto {
  return DsbMannschaftVerAndWettDto.copyFrom(payload);
}
export function fromPayloadArray(payload: VersionedDataTransferObject[]): DsbMannschaftDTO[] {
  const list: DsbMannschaftDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}

export function fromPayloadArrayVerAndWett(payload: DsbMannschaftVerAndWettDo[]): DsbMannschaftVerAndWettDto[] {
  const list: DsbMannschaftVerAndWettDto[] = [];
  payload.forEach((single) => list.push(fromPayloadVerAndWett(single)));
  return list;
}
