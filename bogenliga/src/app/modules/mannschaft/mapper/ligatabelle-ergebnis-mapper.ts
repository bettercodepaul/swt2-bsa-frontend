import {VersionedDataTransferObject} from '../../shared/data-provider';
import {LigatabelleErgebnisDTO} from '../types/datatransfer/ligatabelle-ergebnis-dto.class';
import {LigatabelleErgebnisDO} from '../types/ligatabelle-ergebnis-do.class';
import {VeranstaltungDTO} from "@verwaltung/types/datatransfer/veranstaltung-dto.class";
import {BenutzerRolleDTO} from "@verwaltung/types/datatransfer/benutzer-rolle-dto.class";
import {BenutzerRolleDO} from "@verwaltung/types/benutzer-rolle-do.class";

export function toDO(ligatabelleErgebnisDTO: LigatabelleErgebnisDTO): LigatabelleErgebnisDO {

  const ligatabelleErgebnisDO = new LigatabelleErgebnisDO();

  ligatabelleErgebnisDO.id = ligatabelleErgebnisDTO.id;
  ligatabelleErgebnisDO.version = ligatabelleErgebnisDTO.version;

  ligatabelleErgebnisDO.veranstaltung_id = ligatabelleErgebnisDTO.veranstaltung_id;
  ligatabelleErgebnisDO.wettkampf_tag = ligatabelleErgebnisDTO.wettkampf_tag;
  ligatabelleErgebnisDO.mannschaft_id = ligatabelleErgebnisDTO.mannschaft_id;
  ligatabelleErgebnisDO.mannschaft_nummer = ligatabelleErgebnisDTO.mannschaft_nummer;
  ligatabelleErgebnisDO.tabellenplatz = ligatabelleErgebnisDTO.tabellenplatz;
  ligatabelleErgebnisDO.matchpkt = ligatabelleErgebnisDTO.matchpkt;
  ligatabelleErgebnisDO.matchpkt_gegen = ligatabelleErgebnisDTO.matchpkt_gegen;
  ligatabelleErgebnisDO.satzpkt = ligatabelleErgebnisDTO.satzpkt;
  ligatabelleErgebnisDO.satzpkt_gegen = ligatabelleErgebnisDTO.satzpkt_gegen;
  ligatabelleErgebnisDO.verein_id = ligatabelleErgebnisDTO.verein_id;
  ligatabelleErgebnisDO.verein_name = ligatabelleErgebnisDTO.verein_name;

  ligatabelleErgebnisDO.ligatabelleSatzpunkte = ligatabelleErgebnisDO.satzpkt.toString()+" : "+ligatabelleErgebnisDO.satzpkt_gegen.toString();
  ligatabelleErgebnisDO.ligatabelleMatchpunkte = ligatabelleErgebnisDO.matchpkt.toString()+" : "+ligatabelleErgebnisDO.matchpkt_gegen.toString();


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
