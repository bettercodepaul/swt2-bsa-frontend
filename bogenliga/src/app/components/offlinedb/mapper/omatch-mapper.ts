
import {VersionedDataTransferObject} from '@shared/data-provider';
import {LigasyncmatchDtoClass} from '../types/datatransfer/ligasyncmatch-dto.class';
import {Omatch} from '../types/omatch.interface';


export function toDO(ligasyncmatchDTO: LigasyncmatchDtoClass): Omatch {

  const omatch = new Omatch();

  omatch.id = ligasyncmatchDTO.id;
  omatch.version = 1;

  omatch.matchVersion = ligasyncmatchDTO.version;
  omatch.wettkampfId = ligasyncmatchDTO.wettkampfId;
  omatch.matchNr = ligasyncmatchDTO.matchNr;
  omatch.matchScheibennummer = ligasyncmatchDTO.matchScheibennummer;
  omatch.mannschaftId = ligasyncmatchDTO.mannschaftId;
  omatch.mannschaftName = ligasyncmatchDTO.mannschaftName;
  omatch.nameGegner = ligasyncmatchDTO.nameGegner;
  omatch.scheibennummerGegner = ligasyncmatchDTO.scheibennummerGegner;
  omatch.matchIdGegner = ligasyncmatchDTO.matchIdGegner;
  omatch.naechsteMatchId = ligasyncmatchDTO.naechsteMatchId;
  omatch.naechsteNaechsteMatchNrMatchId = ligasyncmatchDTO.naechsteNaechsteMatchNrMatchId;
  omatch.strafpunkteSatz1 = ligasyncmatchDTO.strafpunkteSatz1;
  omatch.strafpunkteSatz2 = ligasyncmatchDTO.strafpunkteSatz2;
  omatch.strafpunkteSatz3 = ligasyncmatchDTO.strafpunkteSatz3;
  omatch.strafpunkteSatz4 = ligasyncmatchDTO.strafpunkteSatz4;
  omatch.strafpunkteSatz5 = ligasyncmatchDTO.strafpunkteSatz5;

  return omatch;
}

export function toDOArray(ligasyncmatchDTO: LigasyncmatchDtoClass[]): Omatch[] {
  const list: Omatch[] = [];
  ligasyncmatchDTO.forEach((single) => list.push(toDO(single)));
  return list;
}

export function fromPayload(payload: VersionedDataTransferObject): Omatch {

  const ligasyncmatchDTO = LigasyncmatchDtoClass.copyFrom(payload);
  return toDO(ligasyncmatchDTO);
}


export function fromPayloadOmatchArray(payload: VersionedDataTransferObject[]): Omatch[] {
  const list: Omatch[] = [];
  payload.forEach((single) => list.push(fromPayload(single)));
  return list;
}
