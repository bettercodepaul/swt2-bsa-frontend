import {VersionedDataTransferObject} from '../../shared/data-provider';
import {
  WettkampfOfflineSyncDto
} from '@verwaltung/types/datatransfer/wettkampf-offline-sync-dto.class';
import {OfflineWettkampf} from '@shared/data-provider/offlinedb/types/offline-wettkampf.interface';
import {WettkampfDTO} from '@verwaltung/types/datatransfer/wettkampf-dto.class';

export function toDTOFromOfflineWettkampfArray(wettkaempfe: OfflineWettkampf[]): WettkampfDTO[] {
  let list: WettkampfDTO[];
  list = []
  wettkaempfe.forEach((it) =>  list.push(toDTOFromOfflineWettkampf(it)));
  return list;
}

export function toDTOFromOfflineWettkampf(wettkampf: OfflineWettkampf): WettkampfDTO {
  let wettkampfDTO: WettkampfDTO = {

    wettkampfTag : parseInt(wettkampf.tag),
    id : wettkampf.id,
    version : wettkampf.version,
    wettkampfAusrichter : parseInt(wettkampf.ausrichter),
    wettkampfBeginn : wettkampf.beginn,
    wettkampfDisziplinId : wettkampf.disziplinId,
    wettkampfTypId : wettkampf.wettkampftypId,
    wettkampfPlz : wettkampf.plz,
    wettkampfOrtsname : wettkampf.ortsname,
    wettkampfOrtsinfo : wettkampf.ortsinfo,
    wettkampfStrasse : wettkampf.strasse,
    wettkampfVeranstaltungsId : wettkampf.veranstaltungId,
    wettkampfDatum : wettkampf.datum
  }

  return wettkampfDTO;
}

export function fromOfflineWettkampfPayload(payload: VersionedDataTransferObject): OfflineWettkampf {
  return toDO(WettkampfOfflineSyncDto.copyFrom(payload));
}

export function fromOfflineWettkampfPayloadArray(payload: VersionedDataTransferObject[]): OfflineWettkampf[] {
  return payload.map((data) => fromOfflineWettkampfPayload(data));
}

export function toDO(payload: WettkampfOfflineSyncDto): OfflineWettkampf {

  return {
    id: payload.id,
    version: payload.version,
    veranstaltungId: payload.veranstaltungId,
    datum: payload.datum,
    beginn: payload.beginn,
    tag: payload.tag ?? '',
    disziplinId: payload.disziplinId ?? 0,
    wettkampftypId: payload.wettkampftypId ?? 0,
    ausrichter: payload.ausrichter ?? '',
    strasse: payload.strasse ?? '',
    plz: payload.plz ?? '',
    ortsname: payload.ortsname ?? '',
    ortsinfo: payload.ortsinfo ?? '',
    offlinetoken: payload.offlinetoken,


  };

}


