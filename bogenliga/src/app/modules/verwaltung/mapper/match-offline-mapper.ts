import {DataTransferObject} from '@shared/data-provider';
import {MatchOfflineSyncDto} from '@verwaltung/types/datatransfer/match-offline-sync-dto.class';
import {OfflineMatch} from '@shared/data-provider/offlinedb/types/offline-match.interface';


export function toDO(matchOfflineSyncDTO: MatchOfflineSyncDto): OfflineMatch {
  return {
    mannschaftId: matchOfflineSyncDTO.mannschaftId,
    mannschaftName: matchOfflineSyncDTO.mannschaftName,
    matchIdGegner: matchOfflineSyncDTO.matchIdGegner,
    matchNr: matchOfflineSyncDTO.matchNr,
    matchScheibennummer: matchOfflineSyncDTO.matchScheibennummer,
    matchpkt: matchOfflineSyncDTO.matchpkt,
    satzpunkte: matchOfflineSyncDTO.satzpunkte,
    matchVersion: matchOfflineSyncDTO.matchVersion,
    naechsteMatchId: matchOfflineSyncDTO.naechsteMatchId,
    naechsteNaechsteMatchNrMatchId: matchOfflineSyncDTO.naechsteNaechsteMatchNrMatchId,
    nameGegner: matchOfflineSyncDTO.nameGegner,
    scheibennummerGegner: matchOfflineSyncDTO.scheibennummerGegner,
    strafpunkteSatz1: matchOfflineSyncDTO.strafpunkteSatz1,
    strafpunkteSatz2: matchOfflineSyncDTO.strafpunkteSatz2,
    strafpunkteSatz3: matchOfflineSyncDTO.strafpunkteSatz3,
    strafpunkteSatz4: matchOfflineSyncDTO.strafpunkteSatz4,
    strafpunkteSatz5: matchOfflineSyncDTO.strafpunkteSatz5,
    wettkampfId: matchOfflineSyncDTO.wettkampfId,
  };
}

export function fromOfflineMatchPayload(payload: DataTransferObject): MatchOfflineSyncDto {
  return toDO(MatchOfflineSyncDto.copyFrom(payload));
}

export function fromOfflineMatchPayloadArray(payload: DataTransferObject[]): OfflineMatch[] {
  const list: OfflineMatch[] = [];
  payload.forEach((single) => list.push(fromOfflineMatchPayload(single)));
  return list;
}


