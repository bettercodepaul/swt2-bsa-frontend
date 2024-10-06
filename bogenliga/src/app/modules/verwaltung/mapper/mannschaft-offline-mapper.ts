import {VersionedDataTransferObject} from '../../shared/data-provider';
import {DsbMannschaftDTO} from '../types/datatransfer/dsb-mannschaft-dto.class';
import {
  MannschaftOfflineSyncDto
} from '@verwaltung/types/datatransfer/mannschaft-offline-sync-dto.class';
import {
  OfflineMannschaft
} from '@shared/data-provider/offlinedb/types/offline-mannschaft.interface';
import {DsbMannschaftDO} from '@verwaltung/types/dsb-mannschaft-do.class';
import {OfflineVerein} from '@shared/data-provider/offlinedb/types/offline-verein.interface';

export function toDO(offlineSyncDto: MannschaftOfflineSyncDto): OfflineMannschaft {
  return {
    id: offlineSyncDto.id,
    version: offlineSyncDto.version,
    nummer: offlineSyncDto.nummer,
    sortierung: offlineSyncDto.sortierung,
    sportjahr: offlineSyncDto.sportjahr,
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

export function offlineMannschaftFromDsbMannschaftDOArray(mannschaften: DsbMannschaftDO[]): OfflineMannschaft[] {
  return mannschaften.map((mannschaft) => offlineMannschaftFromDsbMannschaftDO(mannschaft));
}

export function offlineMannschaftFromDsbMannschaftDO(mannschaft: DsbMannschaftDO): OfflineMannschaft {
  return {
    benutzerId: mannschaft.benutzerId,
    id: mannschaft.id,
    nummer: parseInt(mannschaft.nummer, 10),
    sortierung: mannschaft.sortierung,
    sportjahr: mannschaft.sportjahr,
    veranstaltungId: mannschaft.veranstaltungId,
    vereinId: mannschaft.vereinId,
    version: 1

  };
}

export function mannschaftDOfromOfflineArray(mannschaften: OfflineMannschaft[], vereine: OfflineVerein[]): DsbMannschaftDO[] {
  return mannschaften.map((mannschaft) => mannschaftDOfromOffline(mannschaft, vereine));
}

export function mannschaftDOfromOffline(m: OfflineMannschaft, vereine: OfflineVerein[]): DsbMannschaftDO {
  let vereinName = '';
  vereine.forEach((v) => {
    if (v.id === m.vereinId) {
      vereinName = v.name;
    }
  });
  return {
    mannschaftNummer:  0,
    vereinName:        '', wettkampfOrtsname: '', wettkampfTag: '',
    benutzerId:        m.benutzerId,
    id:                m.id,
    name:              vereinName + ' ' + m.nummer,
    nummer:            m.nummer.toString(),
    sortierung:        m.sortierung,
    sportjahr:         m.sportjahr,
    veranstaltungId:   m.veranstaltungId,
    veranstaltungName: '',
    vereinId:          m.vereinId,
    version:           m.version
  };
}
