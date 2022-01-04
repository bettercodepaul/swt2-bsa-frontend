import {LigatabelleOdaoClass} from './ligatabelle-odao.class';
import {db} from './offlinedb.component';


export class OfflinedbDataProviderService {

  public currentLigatabelle: LigatabelleOdaoClass[];

  constructor() {
    this.currentLigatabelle = [];
  }

  public getLigatabelle(): LigatabelleOdaoClass[] {

    this.currentLigatabelle = [];
    db.ligatabelle.orderBy('tabellenplatz').each((item: LigatabelleOdaoClass ) => this.currentLigatabelle.push(item));
    return this.currentLigatabelle;
  }
}
