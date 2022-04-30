import {VersionedDataTransferObject} from '../../shared/data-provider';
import {
  WettkampfOfflineSyncDto
} from '@verwaltung/types/datatransfer/wettkampf-offline-sync-dto.class';
import {OfflineWettkampf} from '@shared/data-provider/offlinedb/types/offline-wettkampf.interface';


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
    tag: payload.tag,
    disziplinId: payload.disziplinId,
    wettkampftypId: payload.wettkampftypId,
    ausrichter: payload.ausrichter,
    strasse: payload.strasse,
    plz: payload.plz,
    ortsname: payload.ortsname,
    ortsinfo: payload.ortsinfo,
    offlinetoken: payload.offlinetoken,


  };

}


