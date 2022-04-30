import {
  PasseOfflineSyncDtoClass
} from '@wkdurchfuehrung/types/datatransfer/passe-offline-sync-dto.class';
import {OfflinePasse} from '@shared/data-provider/offlinedb/types/offline-passe.interface';
import {DataTransferObject} from '@shared/data-provider';


export function toDO(passeOfflineSyncDTO: PasseOfflineSyncDtoClass): OfflinePasse {
  // Creates a new instance of the OfflinePasse interface
  return {
    matchId: passeOfflineSyncDTO.matchId,
    mannschaftId: passeOfflineSyncDTO.mannschaftId,
    wettkampfId: passeOfflineSyncDTO.wettkampfId,
    matchNr: passeOfflineSyncDTO.matchNr,
    lfdNr: passeOfflineSyncDTO.lfdNr,
    dsbMitgliedId: passeOfflineSyncDTO.dsbMitgliedId,
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

