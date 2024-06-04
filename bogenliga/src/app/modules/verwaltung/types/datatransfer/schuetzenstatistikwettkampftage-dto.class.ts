import {DataTransferObject} from '@shared/data-provider';

/**
 *  SchützenstatistikWettkampftage DTO Klasse
 */

export class SchuetzenstatistikWettkampftageDTO implements DataTransferObject {
  id: number;
  version: number;
  rueckenNummer: number;
  dsbMitgliedName: string;
  wettkampftag1: number;
  wettkampftag2: number;
  wettkampftag3: number;
  wettkampftag4: number;
  wettkampftageSchnitt: number;

  constructor(
    id: number,
    version: number,
    rueckenNummer: number,
    dsbMitgliedName: string,
    wettkampftag1: number,
    wettkampftag2: number,
    wettkampftag3: number,
    wettkampftag4: number,
    wettkampftageSchnitt: number
  ) {
    this.id = id;
    this.version = version;
    this.rueckenNummer = rueckenNummer;
    this.dsbMitgliedName = dsbMitgliedName;
    this.wettkampftag1 = wettkampftag1;
    this.wettkampftag2 = wettkampftag2;
    this.wettkampftag3 = wettkampftag3;
    this.wettkampftag4 = wettkampftag4;
    this.wettkampftageSchnitt = wettkampftageSchnitt;
  }
  static copyFrom(optional: {
      id?: number,
      version?: number,
      rueckenNummer?: number,
      dsbMitgliedName?: string,
      wettkampftag1?: number,
      wettkampftag2?: number,
      wettkampftag3?: number,
      wettkampftag4?: number,
      wettkampftageSchnitt?: number
    }
  ): SchuetzenstatistikWettkampftageDTO {
    return new SchuetzenstatistikWettkampftageDTO(
      optional.id || null,
      optional.version || null,
      optional.rueckenNummer || null,
      optional.dsbMitgliedName || null,
      optional.wettkampftag1 || null,
      optional.wettkampftag2 || null,
      optional.wettkampftag3 || null,
      optional.wettkampftag4 || null,
      optional.wettkampftageSchnitt || null
    );
  }
}
