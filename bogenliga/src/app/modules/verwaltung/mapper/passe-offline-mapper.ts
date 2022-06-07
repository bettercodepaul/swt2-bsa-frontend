import {
  PasseOfflineSyncDtoClass
} from '@wkdurchfuehrung/types/datatransfer/passe-offline-sync-dto.class';
import {OfflinePasse} from '@shared/data-provider/offlinedb/types/offline-passe.interface';
import {DataTransferObject} from '@shared/data-provider';
import {PasseDTOClass} from '@verwaltung/types/datatransfer/passe-dto.class';
import {PasseDoClass} from '@verwaltung/types/passe-do-class';
import {PasseDTO} from '@wkdurchfuehrung/types/datatransfer/passe-dto.class';


export function toDO(passeOfflineSyncDTO: PasseOfflineSyncDtoClass): OfflinePasse {
  // Creates a new instance of the OfflinePasse interface
  return {
    matchID:        passeOfflineSyncDTO.matchId,
    mannschaftId:   passeOfflineSyncDTO.mannschaftId,
    wettkampfId:    passeOfflineSyncDTO.wettkampfId,
    matchNr:        passeOfflineSyncDTO.matchNr,
    lfdNr:          passeOfflineSyncDTO.lfdNr,
    dsbMitgliedId:  passeOfflineSyncDTO.dsbMitgliedId,
    ringzahlPfeil1: passeOfflineSyncDTO.ringzahl[0],
    ringzahlPfeil2: passeOfflineSyncDTO.ringzahl[1],
    ringzahlPfeil3: passeOfflineSyncDTO.ringzahl[2],
    ringzahlPfeil4: passeOfflineSyncDTO.ringzahl[3],
    ringzahlPfeil5: passeOfflineSyncDTO.ringzahl[4],
    ringzahlPfeil6: passeOfflineSyncDTO.ringzahl[5],
    rueckennummer: passeOfflineSyncDTO.rueckennummer,

  };
}

export function fromOfflinePassePayload(payload: DataTransferObject): OfflinePasse {
  // Copy all properties from payload to dto
  return toDO(PasseOfflineSyncDtoClass.copyFrom(payload));
}

export function fromOfflinePassePayloadArray(payload: DataTransferObject[]): OfflinePasse[] {
  // Create a new Array with Map-Function
  return payload.map((passe) => fromOfflinePassePayload(passe));
}

export function offlinePasseFromDTOClassArray(payload: PasseDTOClass[]): OfflinePasse[] {
  return payload.map(item => offlinePasseFromDTOClass(item))
}

export function offlinePasseFromDTOClass(payload: PasseDTOClass): OfflinePasse {
  return {
    id:             payload.id,
    version:        payload.version,
    lfdNr:          payload.lfdNr,
    dsbMitgliedId:  payload.dsbMitgliedId,
    mannschaftId:   payload.mannschaftId,
    matchID:        payload.matchId,
    matchNr:        payload.matchNr,
    ringzahlPfeil1: payload.ringzahl[0],
    ringzahlPfeil2: payload.ringzahl[1],
    ringzahlPfeil3: payload.ringzahl[2],
    ringzahlPfeil4: payload.ringzahl[3],
    ringzahlPfeil5: payload.ringzahl[4],
    ringzahlPfeil6: 0,
    rueckennummer:  payload.schuetzeNr,
    wettkampfId:    payload.wettkampfId
  }
}

export function toPasseDTOClassFromOfflineArray(payload: OfflinePasse[]): PasseDTOClass[]{
  return payload.map(item => toPasseDTOClassFromOffline(item));
}

export function toPasseDTOClassFromOffline(payload: OfflinePasse): PasseDTOClass{
  return {
    dsbMitgliedId: payload.dsbMitgliedId,
    id:            payload.id,
    lfdNr:         payload.lfdNr,
    mannschaftId:  payload.mannschaftId,
    matchId:       payload.matchID,
    matchNr:       payload.matchNr,
    ringzahl:      [payload.ringzahlPfeil1,payload.ringzahlPfeil2,0,0,0,0],
    schuetzeNr:    payload.rueckennummer,
    version:       payload.version,
    wettkampfId:   payload.wettkampfId
  };
}

export function toPasseDTOFromDoClassArray(payload: PasseDoClass[]): PasseDTO[]{
  return payload.map(item => toPasseDTOFromDoClass(item))
}

export function toPasseDTOFromDoClass(payload: PasseDoClass): PasseDTO{
  return {
    dsbMitgliedId:  payload.dsbMitgliedId,
    id:             payload.id,
    lfdNr:          payload.lfdNr,
    mannschaftId:   payload.mannschaftId,
    matchId:        payload.matchId,
    matchNr:        payload.matchNr,
    ringzahl: payload.ringzahl,
    rueckennummer:  payload.schuetzeNr,
    wettkampfId:    payload.wettkampfId
  }
}
