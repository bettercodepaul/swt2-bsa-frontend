import {VersionedDataTransferObject} from '../../shared/data-provider';
import {
  OfflineDsbMitglied
} from '@shared/data-provider/offlinedb/types/offline-dsbmitglied.interface';
import {
  DsbMitgliedOfflineSyncDto
} from '@verwaltung/types/datatransfer/dsb-mitglied-offline-sync-dto.class';

export function toDO(dsbMitgliedDTO: DsbMitgliedOfflineSyncDto): OfflineDsbMitglied {
  return {
    id: dsbMitgliedDTO.id,
    version: dsbMitgliedDTO.version,
    vorname: dsbMitgliedDTO.vorname,
    nachname: dsbMitgliedDTO.nachname,
    geburtsdatum: dsbMitgliedDTO.geburtsdatum,
    mitgliedsnummer: dsbMitgliedDTO.mitgliedsnummer,
    nationalitaet: dsbMitgliedDTO.nationalitaet,
    benutzerId: dsbMitgliedDTO.benutzerId,
    vereinId: dsbMitgliedDTO.vereinId,
  };
}




export function fromOfflineDsbMitgliedPayload(payload: VersionedDataTransferObject): OfflineDsbMitglied {
  return toDO(DsbMitgliedOfflineSyncDto.copyFrom(payload));
}

export function fromOfflineDsbMitgliedPayloadArray(payload: VersionedDataTransferObject[]): OfflineDsbMitglied[] {
  return payload.map(fromOfflineDsbMitgliedPayload);
}
