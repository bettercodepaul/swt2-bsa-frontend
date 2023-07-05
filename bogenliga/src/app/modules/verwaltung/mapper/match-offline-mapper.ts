import {DataTransferObject} from '@shared/data-provider';
import {MatchOfflineSyncDto} from '@verwaltung/types/datatransfer/match-offline-sync-dto.class';
import {OfflineMatch} from '@shared/data-provider/offlinedb/types/offline-match.interface';
import {MatchDTOExt} from '@wkdurchfuehrung/types/datatransfer/match-dto-ext.class';
import {PasseDTO} from '@wkdurchfuehrung/types/datatransfer/passe-dto.class';


export function toDO(matchOfflineSyncDTO: MatchOfflineSyncDto): OfflineMatch {
  return {
    offlineVersion: 1,

    matchId: matchOfflineSyncDTO.id,
    matchVersion: matchOfflineSyncDTO.version,
    mannschaftId: matchOfflineSyncDTO.mannschaftId,
    mannschaftName: matchOfflineSyncDTO.mannschaftName,
    matchIdGegner: matchOfflineSyncDTO.matchIdGegner,
    matchNr: matchOfflineSyncDTO.matchNr,
    matchScheibennummer: matchOfflineSyncDTO.matchScheibennummer,
    matchpkt: matchOfflineSyncDTO.matchpkt,
    satzpunkte: matchOfflineSyncDTO.satzpunkte,
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

export function toDTOFromOfflineMatchArray(offlineMatches: OfflineMatch[], offlinePassen: PasseDTO[]): MatchDTOExt[] {
  const matches: MatchDTOExt[] = [];
  offlineMatches.forEach((match) => matches.push(toDTOFromOfflineMatch(match, offlinePassen)));
  return matches;
}

export function toDTOFromOfflineMatch(offlineMatch: OfflineMatch, offlinePassen: PasseDTO[]): MatchDTOExt {
  const passen = [];
  offlinePassen.forEach((item) => {
    if (item.matchId === offlineMatch.matchId) {
      passen.push(item);
    }
  });
  const begegnung = Math.ceil(offlineMatch.matchScheibennummer / 2);
  return {
    id: offlineMatch.matchId,
    version: offlineMatch.matchVersion,
    mannschaftId: offlineMatch.mannschaftId,
    mannschaftName: offlineMatch.mannschaftName,
    matchNr: offlineMatch.matchNr,
    begegnung,
    matchpunkte: offlineMatch.matchpkt,
    matchScheibennummer: offlineMatch.matchScheibennummer,
    passen,     // werden aus der passe tabelle geholt, damit sie nicht doppelt gespeichert/übergeben werden müssen
    satzpunkte: offlineMatch.satzpunkte,
    strafPunkteSatz1: offlineMatch.strafpunkteSatz1,
    strafPunkteSatz2: offlineMatch.strafpunkteSatz2,
    strafPunkteSatz3: offlineMatch.strafpunkteSatz3,
    strafPunkteSatz4: offlineMatch.strafpunkteSatz4,
    strafPunkteSatz5: offlineMatch.strafpunkteSatz5,
    wettkampfId: offlineMatch.wettkampfId,
    wettkampfTag: null,  // wird nicht an die OfflineDB übergeben - wird im Backend aus wettkampfID ermittelt und überschrieben
    wettkampfTyp: ''  // wird nicht an die OfflineDB übergeben - wird im Backend aus wettkampfID ermittelt und überschrieben
  };
}

export function fromOfflineMatchPayload(payload: DataTransferObject): OfflineMatch {
  return toDO(MatchOfflineSyncDto.copyFrom(payload));
}

export function fromOfflineMatchPayloadArray(payload: DataTransferObject[]): OfflineMatch[] {
  const list: OfflineMatch[] = [];
  payload.forEach((single) => list.push(fromOfflineMatchPayload(single)));
  return list;
}


