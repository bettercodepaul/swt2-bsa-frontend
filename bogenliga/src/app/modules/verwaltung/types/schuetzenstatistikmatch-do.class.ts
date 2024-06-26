import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';

/**
 *  Schützenstatistik DO Klasse
 */

export class SchuetzenstatistikMatchDO implements VersionedDataObject {
  id: number;
  version: number;
  rueckennummer: number;
  dsbMitgliedName: string;
  match1: number;
  match2: number;
  match3: number;
  match4: number;
  match5: number;
  match6: number;
  match7: number;
  pfeilpunkteSchnitt: number;
  constructor(
    id?: number,
    version?: number,
    rueckennummer?: number,
    dsbMitgliedName?: string,
    match1?: number,
    match2?: number,
    match3?: number,
    match4?: number,
    match5?: number,
    match6?: number,
    match7?: number,
    pfeilpunkteSchnitt?: number
  ) {
    this.id = id;
    this.version = version;
    this.rueckennummer = rueckennummer;
    this.dsbMitgliedName = dsbMitgliedName;
    this.match1 = match1;
    this.match2 = match2;
    this.match3 = match3;
    this.match4 = match4;
    this.match5 = match5;
    this.match6 = match6;
    this.match7 = match7;
    this.pfeilpunkteSchnitt = pfeilpunkteSchnitt;
  }
}
