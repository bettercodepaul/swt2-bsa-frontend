import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';

/**
 *  data object for schuetzenstatistikletztejahre
 *  @author: Alessa Hackh
 */

export class SchuetzenstatistikLetzteJahreDO implements VersionedDataObject {
  id: number;
  version: number;
  schuetzenname: string;
  sportjahr1: number;
  sportjahr2: number;
  sportjahr3: number;
  sportjahr4: number;
  sportjahr5: number;
  allejahre_schnitt: number;

  constructor(
    id?: number,
    version?: number,
    schuetzenname?: string,
    sportjahr1?: number,
    sportjahr2?: number,
    sportjahr3?: number,
    sportjahr4?: number,
    sportjahr5?: number,
    allejahre_schnitt?: number
  ) {
    this.id = id;
    this.version = version;
    this.schuetzenname = schuetzenname;
    this.sportjahr1 = sportjahr1;
    this.sportjahr2 = sportjahr2;
    this.sportjahr3 = sportjahr3;
    this.sportjahr4 = sportjahr4;
    this.sportjahr5 = sportjahr5;
    this.allejahre_schnitt = allejahre_schnitt;
  }
}
