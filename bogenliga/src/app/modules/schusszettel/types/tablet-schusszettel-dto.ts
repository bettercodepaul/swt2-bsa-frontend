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
  NOT_ALLOWED       = 'NOT_ALLOWED',
  WETTKAMPF_BEENDET = 'WETTKAMPF_BEENDET'
}

/**
 * Enthält die vollständige Antwortstruktur für den digitalen Schusszettel auf dem Tablet.
 */
export interface TabletSchusszettelDTO {
  status: TabletSchusszettelStatus;
  eigenesTeam: TeamInfoDTO;
  gegnerischesTeam: TeamInfoDTO;
  schuetzenMatchPunkte: SchuetzeMatchPunkteDTO[];
  schuetzeStammDaten: SchuetzeStammdatenDTO[];
  satzErgebnisse: SatzErgebnisDTO[];
  matchErgebnis: TeamMatchInfoDTO[];
  verfuegbareSchuetzen: VerfuegbarerSchuetzeDTO[];
  wettkampfInfo?: WettkampfInfoDTO;
}
