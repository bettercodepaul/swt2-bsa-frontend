import {LigatabelleOdaoClass} from './ligatabelle-odao.class';
import {db} from './offlinedb.component';
import {MatchOdaoClass} from './match-odao.class';


export class OfflinedbDataProviderService {

  public currentLigatabelle: LigatabelleOdaoClass[];
  public matches: MatchOdaoClass[];

  constructor() {
    this.currentLigatabelle = [];
  }

  public getLigatabelle(): LigatabelleOdaoClass[] {

    this.currentLigatabelle = [];

    db.ligatabelle.orderBy('tabellenplatz').each((item: LigatabelleOdaoClass ) => this.currentLigatabelle.push(item));
    return this.currentLigatabelle;
  }

  public getAllMatches(): MatchOdaoClass[] {
    this.matches = [];
    db.match.orderBy('id').each((item: MatchOdaoClass ) => this.matches.push(item));
    return this.matches;
  }

  // TODO: getAllPasseForMatch(matchid: number): PasseOdaoClass[]
  // TODO: getAllPasse(): PasseOdaoClass[]
  // TODO: getAllMemberOfManschaft(manschaftid): ManschaftOdaoClass[]
}
