import {VersionedDataTransferObject} from '../../shared/data-provider';

import {
  MannschaftsmitgliedOfflineSyncDto
} from '@verwaltung/types/datatransfer/mannschaftsmitglied-offline-sync-dto.class';
import {
  OfflineMannschaftsmitglied
} from '@shared/data-provider/offlinedb/types/offline-mannschaftsmitglied.interface';
import {MannschaftsMitgliedDO} from '@verwaltung/types/mannschaftsmitglied-do.class';
import {MannschaftsmitgliedDTO} from "@verwaltung/types/datatransfer/mannschaftsmitglied-dto.class";

export function toDO(offlineSyncDto: MannschaftsmitgliedOfflineSyncDto): OfflineMannschaftsmitglied {
  return {
    id: offlineSyncDto.id,
    offlineVersion: offlineSyncDto.version,
    mannschaftId: offlineSyncDto.mannschaftId,
    dsbMitgliedEingesetzt: offlineSyncDto.dsbMitgliedEingesetzt,
    dsbMitgliedId: offlineSyncDto.dsbMitgliedId,
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
    dsbMitgliedEingesetzt: payload.dsbMitgliedEingesetzt,
    dsbMitgliedId: payload.dsbMitgliedId,
    id, // id wird im Backend vergeben, deshalb ist darauf zu achten, dass bei neuen Offline Datensätze (offlineVersion =2) eine <null> als ID zurückgegeben wird.
    mannschaftId: payload.mannschaftsId,
    rueckennummer: payload.rueckennummer,
    offlineVersion: 1,
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
