import { OfflineLigatabelle } from '@shared/data-provider/offlinedb/types/offline-ligatabelle.interface';
import {VersionedDataTransferObject} from '@shared/data-provider';
import {LigatabelleErgebnisDTO} from '../types/datatransfer/ligatabelle-ergebnis-dto.class';
import {LigatabelleErgebnisDO} from '../types/ligatabelle-ergebnis-do.class';

export function toDO(ligatabelleErgebnisDTO: LigatabelleErgebnisDTO): LigatabelleErgebnisDO {

  const ligatabelleErgebnisDO = new LigatabelleErgebnisDO();

  ligatabelleErgebnisDO.id = ligatabelleErgebnisDTO.id;
  ligatabelleErgebnisDO.version = ligatabelleErgebnisDTO.version;

  ligatabelleErgebnisDO.veranstaltung_id = ligatabelleErgebnisDTO.veranstaltungId;
  ligatabelleErgebnisDO.veranstaltung_name = ligatabelleErgebnisDTO.veranstaltungName;
  ligatabelleErgebnisDO.wettkampf_id = ligatabelleErgebnisDTO.wettkampfId;
  ligatabelleErgebnisDO.wettkampf_tag = ligatabelleErgebnisDTO.wettkampfTag;
  ligatabelleErgebnisDO.mannschaft_id = ligatabelleErgebnisDTO.mannschaftId;
  ligatabelleErgebnisDO.mannschaft_name = ligatabelleErgebnisDTO.vereinName.toString() + '-' + ligatabelleErgebnisDTO.mannschaftNummer.toString();
  ligatabelleErgebnisDO.verein_id = ligatabelleErgebnisDTO.vereinId;
  ligatabelleErgebnisDO.matchpunkte = ligatabelleErgebnisDTO.matchpkt.toString() + ' : ' + ligatabelleErgebnisDTO.matchpktGegen.toString();
  ligatabelleErgebnisDO.satzpunkte = ligatabelleErgebnisDTO.satzpkt.toString() + ' : ' + ligatabelleErgebnisDTO.satzpktGegen.toString();
  ligatabelleErgebnisDO.satzpkt_differenz = ligatabelleErgebnisDTO.satzpktDifferenz;
  ligatabelleErgebnisDO.tabellenplatz = ligatabelleErgebnisDTO.tabellenplatz;
  ligatabelleErgebnisDO.sortierung = ligatabelleErgebnisDTO.sortierung;

  return ligatabelleErgebnisDO;
}

export function toDOFromOffline(ligatabelle: OfflineLigatabelle): LigatabelleErgebnisDO {
  const ligatabelleErgebnisDO = new LigatabelleErgebnisDO();

  ligatabelleErgebnisDO.id = ligatabelle.id;
  ligatabelleErgebnisDO.version = ligatabelle.version;

  ligatabelleErgebnisDO.veranstaltung_id = ligatabelle.veranstaltungId;
  ligatabelleErgebnisDO.veranstaltung_name = ligatabelle.veranstaltungName;
  ligatabelleErgebnisDO.wettkampf_id = ligatabelle.wettkampfId;
  ligatabelleErgebnisDO.wettkampf_tag = ligatabelle.wettkampfTag;
  ligatabelleErgebnisDO.mannschaft_id = ligatabelle.mannschaftId;
  ligatabelleErgebnisDO.mannschaft_name = ligatabelle.mannschaftName;
  const matchPkte = ligatabelle.matchpkt != null && ligatabelle.matchpktGegen != null ? ligatabelle.matchpkt.toString() + ' : ' + ligatabelle.matchpktGegen.toString() : '0:0';
  ligatabelleErgebnisDO.matchpunkte = matchPkte;
  const satzPkte = ligatabelle.satzpkt != null && ligatabelle.satzpktGegen != null ? ligatabelle.satzpkt.toString() + ' : ' + ligatabelle.satzpktGegen.toString() : '0:0';
  ligatabelleErgebnisDO.satzpunkte = satzPkte;
  ligatabelleErgebnisDO.satzpkt_differenz = ligatabelle.satzpktDifferenz;
  ligatabelleErgebnisDO.tabellenplatz = ligatabelle.tabellenplatz;
  ligatabelleErgebnisDO.sortierung = ligatabelle.sortierung;

  return ligatabelleErgebnisDO;
}

export function toDOArray(ligatabelleErgebnisDTO: LigatabelleErgebnisDTO[]): LigatabelleErgebnisDO[] {
  const list: LigatabelleErgebnisDO[] = [];
  ligatabelleErgebnisDTO.forEach((single) => list.push(toDO(single)));
  return list;
}


export function fromPayload(payload: VersionedDataTransferObject): LigatabelleErgebnisDO {

  const ligatabelleErgebnisDTO = LigatabelleErgebnisDTO.copyFrom(payload);
  return toDO(ligatabelleErgebnisDTO);
}


export function fromPayloadLigatabelleErgebnisArray(payload: VersionedDataTransferObject[]): LigatabelleErgebnisDO[] {
  const list: LigatabelleErgebnisDO[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}

export function fromOfflineLigatabelleArray(ligatabelleArray: OfflineLigatabelle[]): LigatabelleErgebnisDO[] {
  const list: LigatabelleErgebnisDO[] = [];
  ligatabelleArray.forEach((single) => list.push(toDOFromOffline(single)));
  return list;
}
