import {DataTransferObject} from '@shared/data-provider';

/**
 *  data transfer object for schuetzenstatistikletztejahre
 *  @author: Alessa Hackh
 */
export class SchuetzenstatistikLetzteJahreDTO implements DataTransferObject {
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
    id: number,
    version: number,
    schuetzenname: string,
    sportjahr1: number,
    sportjahr2: number,
    sportjahr3: number,
    sportjahr4: number,
    sportjahr5: number,
    allejahre_schnitt: number
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
  static copyFrom(optional: {
      id?: number,
      version?: number,
      schuetzenname?: string,
      sportjahr1?: number,
      sportjahr2?: number,
      sportjahr3?: number,
      sportjahr4?: number,
      sportjahr5?: number,
      allejahre_schnitt?: number
    }
  ): SchuetzenstatistikLetzteJahreDTO {
    return new SchuetzenstatistikLetzteJahreDTO(
      optional.id || null,
      optional.version || null,
      optional.schuetzenname || null,
      optional.sportjahr1 || null,
      optional.sportjahr2 || null,
      optional.sportjahr3 || null,
      optional.sportjahr4 || null,
      optional.sportjahr5 || null,
      optional.allejahre_schnitt || null
    );
  }
}
