import {TabletSchusszettelDTO, TabletSchusszettelStatus} from '@schusszettel/types/tablet-schusszettel-dto';
import {TabletSchusszettel} from '@schusszettel/models/tablet-schusszettel.model';
import {TeamInfoDTO} from '@schusszettel/types/inside/team-info-dto';
import {SchuetzeMatchPunkteDTO} from '@schusszettel/types/inside/schuetze-match-punkte-dto';
import {SchuetzeStammdatenDTO} from '@schusszettel/types/inside/schuetze-stammdaten-dto';
import {SatzErgebnisDTO} from '@schusszettel/types/inside/satz-ergebnis-dto';
import {VerfuegbarerSchuetzeDTO} from '@schusszettel/types/inside/verfuegbarer-schuetze-dto';
import {TeamMatchInfoDTO} from '@schusszettel/types/inside/team-match-info-dto';

export class TabletSchusszettelMapper {
  /**
   * Converts a backend DTO into the front-end TabletSchusszettel model
   * Adds safety for null/undefined arrays and logs input/output for debugging
   */
  static fromDTO(dto: TabletSchusszettelDTO): TabletSchusszettel {
    console.log('=== MAPPER ===');
    console.log('[Mapper] fromDTO input:', dto);
    console.log('[Mapper] status:', dto.status);

    // Debug the shooter data specifically
    console.log('[Mapper] Raw schuetzeStammDaten from backend:', dto.schuetzeStammDaten);
    console.log('[Mapper] schuetzeStammDaten length:', dto.schuetzeStammDaten?.length);

    if (dto.schuetzeStammDaten) {
      dto.schuetzeStammDaten.forEach((s, index) => {
        console.log(`[Mapper] Raw shooter ${index}:`, {
          id: s.schuetzenId,
          rueckennummer: s.rueckennummer,
          vorname: s.vorname,
          nachname: s.nachname
        });
      });
    }

    console.log('[Mapper] Raw verfuegbareSchuetzen from backend:', dto.verfuegbareSchuetzen);
    console.log('[Mapper] verfuegbareSchuetzen length:', dto.verfuegbareSchuetzen?.length);

    if (dto.verfuegbareSchuetzen) {
      dto.verfuegbareSchuetzen.forEach((v, index) => {
        console.log(`[Mapper] Available shooter ${index}:`, {
          id: v.schuetzenId,
          name: v.name
        });
      });
    }

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

    console.log('[Mapper] Mapped schuetzeStammDaten output:', result.schuetzeStammDaten);
    console.log('[Mapper] Mapped verfuegbareSchuetzen output:', result.verfuegbareSchuetzen);
    console.log('[Mapper] fromDTO output:', result);
    console.log('=== END MAPPER ===');
    return result;
  }
}
