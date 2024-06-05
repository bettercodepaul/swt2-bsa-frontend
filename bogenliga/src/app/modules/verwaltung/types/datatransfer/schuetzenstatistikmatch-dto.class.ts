import {DataTransferObject} from '@shared/data-provider';

/**
 *  Schützenstatistik DTO Klasse
 */

export class SchuetzenstatistikMatchDTO implements DataTransferObject {
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
    id: number,
    version: number,
    rueckennummer: number,
    dsbMitgliedName: string,
    match1: number,
    match2: number,
    match3: number,
    match4: number,
    match5: number,
    match6: number,
    match7: number,
    pfeilpunkteSchnitt: number
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
  static copyFrom(optional: {
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
  }
  ): SchuetzenstatistikMatchDTO {
    return new SchuetzenstatistikMatchDTO(
      optional.id || null,
      optional.version || null,
      optional.rueckennummer || null,
      optional.dsbMitgliedName || null,
      optional.match1 || null,
      optional.match2 || null,
      optional.match3 || null,
      optional.match4 || null,
      optional.match5 || null,
      optional.match6 || null,
      optional.match7 || null,
      optional.pfeilpunkteSchnitt || null,
    );
  }
}
