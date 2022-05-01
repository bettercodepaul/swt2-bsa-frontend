import {VersionedDataTransferObject} from '../../shared/data-provider';
import {DsbMannschaftDTO} from '../types/datatransfer/dsb-mannschaft-dto.class';
import {
  MannschaftOfflineSyncDto
} from '@verwaltung/types/datatransfer/mannschaft-offline-sync-dto.class';
import {
  OfflineMannschaft
} from '@shared/data-provider/offlinedb/types/offline-mannschaft.interface';

export function toDO(offlineSyncDto: MannschaftOfflineSyncDto): OfflineMannschaft {
  return {
    id: offlineSyncDto.id,
    version: offlineSyncDto.version,
    nummer: offlineSyncDto.nummer,
    sortierung: offlineSyncDto.sortierung,
    veranstaltungId: offlineSyncDto.veranstaltungId,
    vereinId: offlineSyncDto.vereinId,
    benutzerId: offlineSyncDto.benutzerId,
  };

}

export function fromOfflineMannschaftPayload(payload: VersionedDataTransferObject): OfflineMannschaft {
  return toDO(MannschaftOfflineSyncDto.copyFrom(payload));
}

export function fromOfflineMannschaftPayloadArray(payload: VersionedDataTransferObject[]): OfflineMannschaft[] {
  return payload.map((d) => fromOfflineMannschaftPayload(d));
}
