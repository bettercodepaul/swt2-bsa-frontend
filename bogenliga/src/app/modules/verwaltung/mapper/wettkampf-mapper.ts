import {VersionedDataTransferObject} from '../../shared/data-provider';
import {WettkampfDTO} from '../types/datatransfer/wettkampf-dto.class';
import {WettkampfDO} from '../types/wettkampf-do.class';



export function fromPayload(payload: VersionedDataTransferObject): WettkampfDTO {
  return WettkampfDTO.copyFrom(payload);
}

export function fromPayloadArray(payload: VersionedDataTransferObject[]): WettkampfDTO[] {
  const list: WettkampfDTO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  console.log(list);
  return list;
}

export function ToDO(payload: WettkampfDTO): WettkampfDO {

  return new WettkampfDO(
    payload.id,
    payload.wettkampfVeranstaltungsId,
    payload.wettkampfDatum,
    payload.wettkampfStrasse,
    payload.wettkampfPlz,
    payload.wettkampfOrtsname,
    payload.wettkampfOrtsinfo,
    payload.wettkampfBeginn,
    payload.wettkampfTag,
    payload.wettkampfDisziplinId,
    payload.wettkampfTypId,
    payload.version,
    payload.wettkampfAusrichter,
  );
}

export function ToDTO(payload: WettkampfDO): WettkampfDTO {

  return new WettkampfDTO(
    payload.id,
    payload.wettkampfVeranstaltungsId,
    payload.wettkampfDatum,
    payload.wettkampfStrasse,
    payload.wettkampfPlz,
    payload.wettkampfOrtsname,
    payload.wettkampfOrtsinfo,
    payload.wettkampfBeginn,
    payload.wettkampfTag,
    payload.wettkampfDisziplinId,
    payload.wettkampfTypId,
    payload.version,
    payload.wettkampfAusrichter,
  );
}
