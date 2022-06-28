import {VersionedDataTransferObject} from '../../shared/data-provider';
import {
  OfflineDsbMitglied
} from '@shared/data-provider/offlinedb/types/offline-dsbmitglied.interface';
import {
  DsbMitgliedOfflineSyncDto
} from '@verwaltung/types/datatransfer/dsb-mitglied-offline-sync-dto.class';
import {DsbMitgliedDO} from '@verwaltung/types/dsb-mitglied-do.class';

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

export function fromDOtoOfflineDsbMitgliederArray(payload: DsbMitgliedDO[]): OfflineDsbMitglied[]{
  return payload.map(mitglied => fromDOtoOfflineDsbMitglied(mitglied));
}

export function fromDOtoOfflineDsbMitglied(payload: DsbMitgliedDO): OfflineDsbMitglied{
  return{
    benutzerId:      payload.userId,
    geburtsdatum:    payload.geburtsdatum,
    id:              payload.id,
    mitgliedsnummer: payload.mitgliedsnummer,
    nachname:        payload.nachname,
    nationalitaet:   payload.nationalitaet,
    vereinId:        payload.vereinsId,
    version:         1,
    vorname:         payload.vorname

  }
}

export function fromOfflineDsbMitgliedPayload(payload: VersionedDataTransferObject): OfflineDsbMitglied {
  return toDO(DsbMitgliedOfflineSyncDto.copyFrom(payload));
}

export function fromOfflineDsbMitgliedPayloadArray(payload: VersionedDataTransferObject[]): OfflineDsbMitglied[] {
  return payload.map(fromOfflineDsbMitgliedPayload);
}
