import {VersionedDataTransferObject} from '../../shared/data-provider';

import {
  MannschaftsmitgliedOfflineSyncDto
} from '@verwaltung/types/datatransfer/mannschaftsmitglied-offline-sync-dto.class';
import {
  OfflineMannschaftsmitglied
} from '@shared/data-provider/offlinedb/types/offline-mannschaftsmitglied.interface';

export function toDO(offlineSyncDto: MannschaftsmitgliedOfflineSyncDto): OfflineMannschaftsmitglied {
  return {
    id: offlineSyncDto.id,
    version: offlineSyncDto.version,
    mannschaftId: offlineSyncDto.mannschaftId,
    dsbMitgliedEingesetzt: offlineSyncDto.dsbMitgliedEingesetzt,
    dsbMitgliedId: offlineSyncDto.dsbMitgliedId,
    rueckennummer: offlineSyncDto.rueckennummer,

  };
}


export function fromOfflineMannschaftsmitgliedPayload(payload: VersionedDataTransferObject): OfflineMannschaftsmitglied {
  return toDO(MannschaftsmitgliedOfflineSyncDto.copyFrom(payload));
}

export function fromOfflineMannschaftsmitgliedPayloadArray(payload: VersionedDataTransferObject[]): OfflineMannschaftsmitglied[] {
  // return payload.map(p => fromPayload(p));
  // same thing as above but with shorter syntax
  return payload.map(fromOfflineMannschaftsmitgliedPayload);
}
