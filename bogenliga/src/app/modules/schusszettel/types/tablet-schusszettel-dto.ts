import {TeamInfoDTO} from './inside/team-info-dto';
import {SchuetzeMatchPunkteDTO} from './inside/schuetze-match-punkte-dto';
import {SchuetzeStammdatenDTO} from './inside/schuetze-stammdaten-dto';
import {SatzErgebnisDTO} from './inside/satz-ergebnis-dto';
import {TeamMatchInfoDTO} from './inside/team-match-info-dto';
import {VerfuegbarerSchuetzeDTO} from './inside/verfuegbarer-schuetze-dto';
import {WettkampfInfoDTO} from '@schusszettel/types/inside/wettkampf-info-dto';

/**
 * Statuswerte, die den aktuellen Zustand der Tablet-Eingabemaske darstellen.
 */
export enum TabletSchusszettelStatus {
  SATZEINGABE       = 'SATZEINGABE',
  SCHUETZENMELDUNG  = 'SCHUETZENMELDUNG',
  WARTE             = 'WARTE',
  MATCH_ENDE        = 'MATCH_ENDE',
  NOT_ALLOWED       = 'NOT_ALLOWED',
  WETTKAMPF_ENDE = 'WETTKAMPF_ENDE'
}

/**
 * Enthält die vollständige Antwortstruktur für den digitalen Schusszettel auf dem Tablet.
 */
export interface TabletSchusszettelDTO {
  status: TabletSchusszettelStatus;
  eigenesTeam: TeamInfoDTO;
  gegnerischesTeam: TeamInfoDTO;
  schuetzenMatchPunkte: SchuetzeMatchPunkteDTO[];
  schuetzeStammDaten: SchuetzeStammdatenDTO[];  // Ensure consistent naming
  satzErgebnisse: SatzErgebnisDTO[];
  matchErgebnis: TeamMatchInfoDTO[];
  verfuegbareSchuetzen: VerfuegbarerSchuetzeDTO[];
  wettkampfInfo?: WettkampfInfoDTO;  // Add optional wettkampfInfo
  currentPasseNumber?: number;       // Backend-provided current passe number
  eigenesTeamMatchId?: number;       // Match ID for own team
  gegnerischesTeamMatchId?: number;  // Match ID for enemy team
}

