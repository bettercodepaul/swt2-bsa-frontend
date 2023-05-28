import {VersionedDataTransferObject} from '@shared/data-provider';

import {VeranstaltungOfflineSyncDto} from '@verwaltung/types/datatransfer/veranstaltung-offline-sync-dto.class';
import {OfflineVeranstaltung} from '@shared/data-provider/offlinedb/types/offline-veranstaltung.interface';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';


export function toDO(offlineSyncDto: VeranstaltungOfflineSyncDto): OfflineVeranstaltung {
  return {
    offlineVersion: 1,
    version:        offlineSyncDto.version,
    id:             offlineSyncDto.id,
    wettkampfTypId: offlineSyncDto.wettkampfTypId,
    name:           offlineSyncDto.name,
    sportjahr: offlineSyncDto.sportjahr,
    meldeDeadline: offlineSyncDto.meldeDeadline,
    ligaleiterId: offlineSyncDto.ligaleiterId,
    ligaId: offlineSyncDto.ligaId,
    phase: offlineSyncDto.phase,
    groesse: offlineSyncDto.groesse
  };
}

export function fromOfflineVeranstaltungPayload(payload: VersionedDataTransferObject): OfflineVeranstaltung {
  return toDO(VeranstaltungOfflineSyncDto.copyFrom(payload));
}

export function fromOfflineVeranstaltungPayloadArray(payload: VersionedDataTransferObject[]): OfflineVeranstaltung[] {
  //
  return payload.map(fromOfflineVeranstaltungPayload);
}

export function toDOfromOfflineVeranstaltung(veranstaltung: OfflineVeranstaltung): VeranstaltungDO {
  const veranstaltungDO: VeranstaltungDO = {
    id: veranstaltung.id,
    version: veranstaltung.version,
    wettkampfTypId: veranstaltung.wettkampfTypId,
    name: veranstaltung.name,
    sportjahr: veranstaltung.sportjahr,
    meldeDeadline: veranstaltung.meldeDeadline,
    ligaleiterId: veranstaltung.ligaleiterId,
    ligaId: veranstaltung.ligaId,
    ligaleiterEmail: '',
    ligaName: veranstaltung.name,
    wettkampftypName: '',
    phase: veranstaltung.phase,
    groesse: veranstaltung.groesse
  };
  return veranstaltungDO;
}

export function toDOfromOfflineVeranstaltungArray(veranstaltungArray: OfflineVeranstaltung[]): VeranstaltungDO[] {
  const list: VeranstaltungDO[] = [];
  veranstaltungArray.forEach((single) => list.push(toDOfromOfflineVeranstaltung(single)));
  return list;
}

export function toOfflineFromVeranstaltungDO(veranstaltung: VeranstaltungDO): OfflineVeranstaltung {
  return {
    offlineVersion: 1,
    id: veranstaltung.id,
    ligaId: veranstaltung.ligaId,
    ligaleiterId: veranstaltung.ligaleiterId,
    meldeDeadline: veranstaltung.meldeDeadline,
    name: veranstaltung.name,
    sportjahr: veranstaltung.sportjahr,
    version: veranstaltung.version,
    wettkampfTypId: veranstaltung.wettkampfTypId,
    phase: veranstaltung.phase,
    groesse: veranstaltung.groesse
  };
}
