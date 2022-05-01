import {VersionedDataTransferObject} from '@shared/data-provider';

import {
  VeranstaltungOfflineSyncDto
} from '@verwaltung/types/datatransfer/veranstaltung-offline-sync-dto.class';
import {
  OfflineVeranstaltung
} from '@shared/data-provider/offlinedb/types/offline-veranstaltung.interface';


export function toDO(offlineSyncDto: VeranstaltungOfflineSyncDto): OfflineVeranstaltung {
  return {
    id: offlineSyncDto.id,
    version: offlineSyncDto.version,
    wettkampfTypId: offlineSyncDto.wettkampfTypId,
    name: offlineSyncDto.name,
    sportjahr: offlineSyncDto.sportjahr,
    meldeDeadline: offlineSyncDto.meldeDeadline,
    ligaleiterId: offlineSyncDto.ligaleiterId,
    ligaId: offlineSyncDto.ligaId,
  };
}

export function fromOfflineVeranstaltungPayload(payload: VersionedDataTransferObject): OfflineVeranstaltung {
  return toDO(VeranstaltungOfflineSyncDto.copyFrom(payload));
}

export function fromOfflineVeranstaltungPayloadArray(payload: VersionedDataTransferObject[]): OfflineVeranstaltung[] {
  //
  return payload.map(fromOfflineVeranstaltungPayload);
}


