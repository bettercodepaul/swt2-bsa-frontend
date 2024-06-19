import {VersionedDataObject} from '../../shared/data-provider/models/versioned-data-object.interface';

export class MannschaftTabellenverlaufSportjahre implements VersionedDataObject {
  constructor() {
    this.tabellenplatzierung_sportjahr1 = null;
    this.tabellenplatzierung_sportjahr2 = null;
    this.tabellenplatzierung_sportjahr3 = null;
    this.tabellenplatzierung_sportjahr4 = null;
    this.tabellenplatzierung_sportjahr5 = null;
  }
  nr: number;
  id: number;
  version: number;
  tabellenplatzierung_sportjahr1: string;
  tabellenplatzierung_sportjahr2: string;
  tabellenplatzierung_sportjahr3: string;
  tabellenplatzierung_sportjahr4: string;
  tabellenplatzierung_sportjahr5: string;
}
