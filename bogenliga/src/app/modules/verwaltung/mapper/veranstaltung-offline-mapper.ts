import {VersionedDataTransferObject} from '@shared/data-provider';

import {
  VeranstaltungOfflineSyncDto
} from '@verwaltung/types/datatransfer/veranstaltung-offline-sync-dto.class';
import {
  OfflineVeranstaltung
} from '@shared/data-provider/offlinedb/types/offline-veranstaltung.interface';
import {OfflineLigatabelle} from '@shared/data-provider/offlinedb/types/offline-ligatabelle.interface';
import {LigatabelleErgebnisDO} from '../../ligatabelle/types/ligatabelle-ergebnis-do.class';
import {toDOFromOffline} from '../../ligatabelle/mapper/ligatabelle-ergebnis-mapper';
import {VeranstaltungDO} from '@verwaltung/types/veranstaltung-do.class';


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

export function toDOfromOfflineVeranstaltung(veranstaltung: OfflineVeranstaltung): VeranstaltungDO{
  let veranstaltungDO: VeranstaltungDO = {
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
    wettkampftypName: ''
  }
  return veranstaltungDO
}

export function toDOfromOfflineVeranstaltungArray(veranstaltungArray: OfflineVeranstaltung[]): VeranstaltungDO[] {
  const list: VeranstaltungDO[] = [];
  veranstaltungArray.forEach((single) => list.push(toDOfromOfflineVeranstaltung(single)));
  return list;
}

