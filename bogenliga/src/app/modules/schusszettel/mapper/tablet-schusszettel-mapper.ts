import {
  TabletSchusszettelDTO,
  TabletSchusszettelStatus
} from '../types/tablet-schusszettel-dto';
import { TabletSchusszettel } from '../models/tablet-schusszettel.model';
import { TeamInfoDTO } from '../types/inside/team-info-dto';
import { SchuetzeMatchPunkteDTO } from '../types/inside/schuetze-match-punkte-dto';
import { SchuetzeStammdatenDTO } from '../types/inside/schuetze-stammdaten-dto';
import { SatzErgebnisDTO } from '../types/inside/satz-ergebnis-dto';
import { TeamMatchInfoDTO } from '../types/inside/team-match-info-dto';
import { VerfuegbarerSchuetzeDTO } from '../types/inside/verfuegbarer-schuetze-dto';

export class TabletSchusszettelMapper {
  /**
   * Converts a backend DTO into the front-end TabletSchusszettel model
   * Adds safety for null/undefined arrays and logs input/output for debugging
   */
  static fromDTO(dto: TabletSchusszettelDTO): TabletSchusszettel {
    console.log('[Mapper] fromDTO input:', dto);

    const eigenesTeam = dto.eigenesTeam ?? { teamId: 0, teamName: '' } as TeamInfoDTO;
    const gegnerTeam = dto.gegnerischesTeam ?? { teamId: 0, teamName: '' } as TeamInfoDTO;

    const schuetzenMatchPunkte = (dto.schuetzenMatchPunkte ?? []).map((p: SchuetzeMatchPunkteDTO) => ({
      schuetzenId: p.schuetzenId,
      punkteBisher: p.punkteBisher
    }));

    const schuetzeStammDaten = (dto.schuetzeStammDaten ?? []).map((s: SchuetzeStammdatenDTO) => ({
      schuetzenId:  s.schuetzenId,
      rueckennummer: s.rueckennummer,
      vorname:       s.vorname,
      nachname:      s.nachname
    }));

    const satzErgebnisse = (dto.satzErgebnisse ?? []).map((e: SatzErgebnisDTO) => ({
      satzNr:      e.satzNr,
      team1Punkte: e.team1Punkte,
      team2Punkte: e.team2Punkte
    }));

    const matchErgebnis = (dto.matchErgebnis ?? []).map((m: TeamMatchInfoDTO) => ({
      teamId:      m.teamId,
      teamName:    m.teamName,
      matchpunkte: m.matchpunkte
    }));

    const verfuegbareSchuetzen = (dto.verfuegbareSchuetzen ?? []).map((v: VerfuegbarerSchuetzeDTO) => ({
      schuetzenId: v.schuetzenId,
      name:        v.name
    }));

    const result: TabletSchusszettel = {
      status: dto.status as TabletSchusszettelStatus,
      eigenesTeam: {
        teamId: eigenesTeam.teamId,
        teamName: eigenesTeam.teamName
      },
      gegnerischesTeam: {
        teamId: gegnerTeam.teamId,
        teamName: gegnerTeam.teamName
      },
      schuetzenMatchPunkte,
      schuetzeStammDaten,
      satzErgebnisse,
      matchErgebnis,
      verfuegbareSchuetzen
    };

    console.log('[Mapper] fromDTO output:', result);
    return result;
  }
}
