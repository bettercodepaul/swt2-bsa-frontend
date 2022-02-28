import { DataTransferObject } from '@shared/data-provider';
import { OfflineLigatabelle } from '@shared/data-provider/offlinedb/types/offline-ligatabelle.interface';
import { LigatabelleOfflineSyncDto } from '@wettkampf/../types/datatransfer/ligatabelle-offline-sync-dto.class';

export function toDO(ligatabelleOfflineSyncDto: LigatabelleOfflineSyncDto): OfflineLigatabelle {

    const offlineTabelle: OfflineLigatabelle = {
      veranstaltungId: ligatabelleOfflineSyncDto.veranstaltungId, // technischer Schüssel der Veranstaltung (Liga im Jahr)
      veranstaltungName: ligatabelleOfflineSyncDto.veranstaltungName, // Bezeichnung der Veranstaltung
      wettkampfId: ligatabelleOfflineSyncDto.wettkampfId, // technischer Schlüssel des aktuellen Wettkampftages
      wettkampfTag: ligatabelleOfflineSyncDto.wettkampfTag, // Nummer des Wettkampftages i.d.R. <= 4
      mannschaftId: ligatabelleOfflineSyncDto.mannschaftId, // Mannschaft der Liga
      mannschaftName: ligatabelleOfflineSyncDto.mannschaftName, // Bezeichnung der Mannschaft i.D.R. Vereinsname + ein Nummer
      matchpkt: ligatabelleOfflineSyncDto.matchpkt, // akt. Stand der Matchpunkte der Mannschaft vor Wettkampfbeginn
      matchpktGegen: ligatabelleOfflineSyncDto.matchpktGegen, // akt. Stand der Gegen-Matchpunkte der Mannschaft vor Wettkampfbeginn
      satzpkt: ligatabelleOfflineSyncDto.satzpkt, // akt. Stand der Satzpunkte der Mannschaft vor Wettkampfbeginn
      satzpktGegen: ligatabelleOfflineSyncDto.satzpktGegen, // akt. Stand der Gegen-Satzpunkte der Mannschaft vor Wettkampfbeginn
      satzpktDifferenz: ligatabelleOfflineSyncDto.satzpktDifferenz, // akt. Stand der Satzpunktedifferenz der Mannschaft vor Wettkampfbeginn
      sortierung: ligatabelleOfflineSyncDto.sortierung, // Sortierungskennzeichen zu Liga.Start
      tabellenplatz: ligatabelleOfflineSyncDto.tabellenplatz // Tabellenplatz der Mannschaft vor Wettkampfbeginn
    };
    return offlineTabelle;
  }

export function toDOArray(ligasyncligatabelleDTO: LigatabelleOfflineSyncDto[]): OfflineLigatabelle[] {
    const list: OfflineLigatabelle[] = [];
    ligasyncligatabelleDTO.forEach((single) => list.push(toDO(single)));
    return list;
  }

export function fromPayload(payload: DataTransferObject): OfflineLigatabelle {

    const ligasyncligatabelleDTO = LigatabelleOfflineSyncDto.copyFrom(payload);
    return toDO(ligasyncligatabelleDTO);
  }

export function fromPayloadOfflineLigatabelleArray(payload: DataTransferObject[]): OfflineLigatabelle[] {
    const list: OfflineLigatabelle[] = [];
    payload.forEach((single) => list.push(fromPayload(single)));
    return list;
  }
