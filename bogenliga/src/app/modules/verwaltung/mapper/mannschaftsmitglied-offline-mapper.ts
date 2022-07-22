import {VersionedDataTransferObject} from '../../shared/data-provider';

import {
  MannschaftsmitgliedOfflineSyncDto
} from '@verwaltung/types/datatransfer/mannschaftsmitglied-offline-sync-dto.class';
import {
  OfflineMannschaftsmitglied
} from '@shared/data-provider/offlinedb/types/offline-mannschaftsmitglied.interface';
import {MannschaftsMitgliedDO} from '@verwaltung/types/mannschaftsmitglied-do.class';
import {MannschaftsmitgliedDTO} from '@verwaltung/types/datatransfer/mannschaftsmitglied-dto.class';

export function toDO(offlineSyncDto: MannschaftsmitgliedOfflineSyncDto): OfflineMannschaftsmitglied {
  return {
    key: null,
    offlineVersion: 1,
    id: offlineSyncDto.id,
    version: offlineSyncDto.version,
    mannschaftId: offlineSyncDto.mannschaftId,
    dsbMitgliedId: offlineSyncDto.dsbMitgliedId,
    dsbMitgliedEingesetzt: offlineSyncDto.dsbMitgliedEingesetzt,
    rueckennummer: offlineSyncDto.rueckennummer,

  };
}

export function fromOfflineMannschaftsmitgliedToDOArray(payload: OfflineMannschaftsmitglied[]): MannschaftsMitgliedDO[] {
  return payload.map((mitglied) => fromOfflineMannschaftsmitgliedToDO(mitglied));
}

export function fromOfflineMannschaftsmitgliedToDO(payload: OfflineMannschaftsmitglied): MannschaftsMitgliedDO {
  return {
    dsbMitgliedEingesetzt: payload.dsbMitgliedEingesetzt, dsbMitgliedId: payload.dsbMitgliedId, id: payload.id,
    mannschaftsId: payload.mannschaftId, rueckennummer: payload.rueckennummer, version: payload.rueckennummer
  };
}

export function fromDOToOfflineMannschaftsmitglied(payload: MannschaftsMitgliedDO, id: number): OfflineMannschaftsmitglied {
  return {
    key: null,
    offlineVersion: 1,
    id: payload.id,
    version: payload.version,
    mannschaftId: payload.mannschaftsId,
    dsbMitgliedId: payload.dsbMitgliedId,
    dsbMitgliedEingesetzt: payload.dsbMitgliedEingesetzt,
    rueckennummer: payload.rueckennummer,
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

export function fromOfflineMannschaftsmitgliedToDTOArray(payload: OfflineMannschaftsmitglied[]): MannschaftsmitgliedDTO[] {
  return payload.map((mitglied) => fromOfflineMannschaftsmitgliedToDTO(mitglied));
}

export function fromOfflineMannschaftsmitgliedToDTO(payload: OfflineMannschaftsmitglied): MannschaftsmitgliedDTO {
  return {
    id: payload.id,
    version: payload.offlineVersion,
    mannschaftsId: payload.mannschaftId,
    dsbMitgliedId: payload.dsbMitgliedId,
    dsbMitgliedEingesetzt: payload.dsbMitgliedEingesetzt,
    rueckennummer: payload.rueckennummer
  };
}
