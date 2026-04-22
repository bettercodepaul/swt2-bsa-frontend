import {TabletSchusszettelStatus} from '@schusszettel/types/tablet-schusszettel-dto';
import {TeamInfoDTO} from '@schusszettel/types/inside/team-info-dto';
import {SchuetzeMatchPunkteDTO} from '@schusszettel/types/inside/schuetze-match-punkte-dto';
import {SchuetzeStammdatenDTO} from '@schusszettel/types/inside/schuetze-stammdaten-dto';
import {SatzErgebnisDTO} from '@schusszettel/types/inside/satz-ergebnis-dto';
import {TeamMatchInfoDTO} from '@schusszettel/types/inside/team-match-info-dto';
import {VerfuegbarerSchuetzeDTO} from '@schusszettel/types/inside/verfuegbarer-schuetze-dto';
import {WettkampfInfoDTO} from '@schusszettel/types/inside/wettkampf-info-dto';

export interface TabletSchusszettel {
  status: TabletSchusszettelStatus;
  eigenesTeam: TeamInfoDTO;
  gegnerischesTeam: TeamInfoDTO;
  schuetzenMatchPunkte: SchuetzeMatchPunkteDTO[];
  schuetzeStammDaten: SchuetzeStammdatenDTO[];
  satzErgebnisse: SatzErgebnisDTO[];
  matchErgebnis: TeamMatchInfoDTO[];
  verfuegbareSchuetzen: VerfuegbarerSchuetzeDTO[];
  wettkampfInfo?: WettkampfInfoDTO;  // Optional wettkampf information
  currentPasseNumber?: number;       // Backend-provided current passe number
  eigenesTeamMatchId?: number;       // Match ID for own team
  gegnerischesTeamMatchId?: number;  // Match ID for enemy team
  eigenesTeamScheibennummer?: number; // own team target number
}
