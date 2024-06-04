import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';

/**
 *  SchützenstatistikWettkampftage DO Klasse
 */

export class SchuetzenstatistikWettkampftageDO implements VersionedDataObject {
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
    id?: number,
    version?: number,
    rueckenNummer?: number,
    dsbMitgliedName?: string,
    wettkampftag1?: number,
    wettkampftag2?: number,
    wettkampftag3?: number,
    wettkampftag4?: number,
    wettkampftageSchnitt?: number
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
}
