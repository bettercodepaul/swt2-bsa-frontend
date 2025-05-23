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
  static fromDTO(dto: TabletSchusszettelDTO): TabletSchusszettel {
    return {
      status: dto.status,
      eigenesTeam: {
        teamId: dto.eigenesTeam.teamId,
        teamName: dto.eigenesTeam.teamName
      },
      gegnerischesTeam: {
        teamId: dto.gegnerischesTeam.teamId,
        teamName: dto.gegnerischesTeam.teamName
      },

      schuetzenMatchPunkte: dto.schuetzenMatchPunkte.map((p) => ({
        schuetzenId: p.schuetzenId,
        punkteBisher: p.punkteBisher
      })),

      schuetzeStammDaten: dto.schuetzeStammDaten.map((s) => ({
        schuetzenId:  s.schuetzenId,
        rueckennummer: s.rueckennummer,
        vorname:       s.vorname,
        nachname:      s.nachname
      })),

      satzErgebnisse: dto.satzErgebnisse.map((e) => ({
        satzNr:     e.satzNr,
        team1Punkte: e.team1Punkte,
        team2Punkte: e.team2Punkte
      })),

      matchErgebnis: dto.matchErgebnis.map((m) => ({
        teamId:     m.teamId,
        teamName:   m.teamName,
        matchpunkte: m.matchpunkte
      })),

      verfuegbareSchuetzen: dto.verfuegbareSchuetzen.map((v) => ({
        schuetzenId: v.schuetzenId,
        name:        v.name
      })),
    };
  }
}
