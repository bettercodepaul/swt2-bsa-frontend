
import {VersionedDataTransferObject} from '@shared/data-provider';
import {LigasyncligatabelleDtoClass} from '../types/datatransfer/ligasyncligatabelle-dto.class';
import {Oligatabelle} from '../types/oligatabelle.interface';


export function toDO(ligasyncligatabelleDTO: LigasyncligatabelleDtoClass): Oligatabelle {

  const oligatabelle = new Oligatabelle();

  oligatabelle.id = ligasyncligatabelleDTO.id;
  oligatabelle.version = ligasyncligatabelleDTO.version;

  oligatabelle.veranstaltungId = ligasyncligatabelleDTO.veranstaltungId;
  oligatabelle.veranstaltungName = ligasyncligatabelleDTO.veranstaltungName;
  oligatabelle.wettkampfId = ligasyncligatabelleDTO.wettkampfId;
  oligatabelle.wettkampfTag = ligasyncligatabelleDTO.wettkampfTag;
  oligatabelle.mannschaftId = ligasyncligatabelleDTO.mannschaftId;
  oligatabelle.mannschaftName = ligasyncligatabelleDTO.mannschaftName;
  oligatabelle.matchpkt = ligasyncligatabelleDTO.matchpkt;
  oligatabelle.matchpktGegen = ligasyncligatabelleDTO.matchpktGegen;
  oligatabelle.satzpkt = ligasyncligatabelleDTO.satzpkt;
  oligatabelle.satzpktGegen = ligasyncligatabelleDTO.satzpktGegen;
  oligatabelle.satzpktDifferenz = ligasyncligatabelleDTO.satzpktDifferenz;
  oligatabelle.sortierung = ligasyncligatabelleDTO.sortierung;
  oligatabelle.tabellenplatz = ligasyncligatabelleDTO.tabellenplatz;

  return oligatabelle;
}

export function toDOArray(ligasyncligatabelleDTO: LigasyncligatabelleDtoClass[]): Oligatabelle[] {
  const list: Oligatabelle[] = [];
  ligasyncligatabelleDTO.forEach((single) => list.push(toDO(single)));
  return list;
}

export function fromPayload(payload: VersionedDataTransferObject): Oligatabelle {

  const ligasyncligatabelleDTO = LigasyncligatabelleDtoClass.copyFrom(payload);
  return toDO(ligasyncligatabelleDTO);
}


export function fromPayloadOligatabelleArray(payload: VersionedDataTransferObject[]): Oligatabelle[] {
  const list: Oligatabelle[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}
