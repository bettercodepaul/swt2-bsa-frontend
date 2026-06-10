// Update your tablet-schusszettel-mapper.ts to include wettkampfInfo mapping

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

    // Validate required fields
    if (!dto) {
      throw new Error('TabletSchusszettelDTO is null or undefined');
    }

    // Map status with fallback
    let mappedStatus: TabletSchusszettelStatus;
    try {
      // Handle backend sending WETTKAMPF_ENDE vs frontend expecting WETTKAMPF_BEENDET
      if (dto.status === 'WETTKAMPF_ENDE' as any) {
        mappedStatus = TabletSchusszettelStatus.WETTKAMPF_BEENDET;
      } else {
        mappedStatus = dto.status as TabletSchusszettelStatus;
      }
    } catch (e) {
      console.warn('[Mapper] Invalid status, defaulting to NOT_ALLOWED:', dto.status);
      mappedStatus = TabletSchusszettelStatus.NOT_ALLOWED;
    }

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

    console.log('[Mapper] Raw wettkampfInfo from backend:', dto.wettkampfInfo);

    // Provide safe defaults for team info
    const eigenesTeam = dto.eigenesTeam ?? { teamId: 0, teamName: 'Unknown Team' } as TeamInfoDTO;
    const gegnerTeam = dto.gegnerischesTeam ?? { teamId: 0, teamName: 'Unknown Opponent' } as TeamInfoDTO;

    // Safe mapping with null checks and defaults
    const schuetzenMatchPunkte = (dto.schuetzenMatchPunkte ?? []).map((p: SchuetzeMatchPunkteDTO) => ({
      schuetzenId: p.schuetzenId ?? 0,
      punkteBisher: p.punkteBisher ?? 0
    }));

    const schuetzeStammDaten = (dto.schuetzeStammDaten ?? []).map((s: SchuetzeStammdatenDTO) => ({
      schuetzenId: s.schuetzenId ?? 0,
      rueckennummer: s.rueckennummer ?? 0,
      vorname: s.vorname ?? '',
      nachname: s.nachname ?? ''
    }));

    const satzErgebnisse = (dto.satzErgebnisse ?? []).map((e: SatzErgebnisDTO) => ({
      satzNr: e.satzNr ?? 0,
      team1Punkte: e.team1Punkte ?? 0,
      team2Punkte: e.team2Punkte ?? 0
    }));

    const matchErgebnis = (dto.matchErgebnis ?? []).map((m: TeamMatchInfoDTO) => ({
      teamId: m.teamId ?? 0,
      teamName: m.teamName ?? '',
      matchpunkte: m.matchpunkte ?? 0
    }));

    const verfuegbareSchuetzen = (dto.verfuegbareSchuetzen ?? []).map((v: VerfuegbarerSchuetzeDTO) => ({
      schuetzenId: v.schuetzenId ?? 0,
      name: v.name ?? ''
    }));

    // Map wettkampfInfo if available
    const wettkampfInfo = dto.wettkampfInfo ? {
      wettkampfId: dto.wettkampfInfo.wettkampfId ?? 0,
      wettkampfTag: dto.wettkampfInfo.wettkampfTag ?? 0,
      wettkampfDatum: dto.wettkampfInfo.wettkampfDatum ?? '',
      wettkampfBeginn: dto.wettkampfInfo.wettkampfBeginn ?? '',
      wettkampfOrtsname: dto.wettkampfInfo.wettkampfOrtsname ?? '',
      wettkampfOrtsinfo: dto.wettkampfInfo.wettkampfOrtsinfo ?? '',
      wettkampfStrasse: dto.wettkampfInfo.wettkampfStrasse ?? '',
      wettkampfPlz: dto.wettkampfInfo.wettkampfPlz ?? '',
      veranstaltungId: dto.wettkampfInfo.veranstaltungId ?? 0,
      veranstaltungName: dto.wettkampfInfo.veranstaltungName ?? '',
      veranstaltungSportjahr: dto.wettkampfInfo.veranstaltungSportjahr ?? 0,
      ligaName: dto.wettkampfInfo.ligaName ?? '',
      wettkampftypName: dto.wettkampfInfo.wettkampftypName ?? ''
    } : undefined;

    const result: TabletSchusszettel = {
      status: mappedStatus,
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
      verfuegbareSchuetzen,
      wettkampfInfo,  // Add wettkampfInfo to the result
      currentPasseNumber: dto.currentPasseNumber,        // Backend-provided passe number
      eigenesTeamMatchId: dto.eigenesTeamMatchId,        // Own team match ID
      gegnerischesTeamMatchId: dto.gegnerischesTeamMatchId,  // Enemy team match ID
      eigenesTeamMatchNr: dto.eigenesTeamMatchNr         // Own team match number (1, 2, 3, etc.)
    };


    console.log('[Mapper] Mapped schuetzeStammDaten output:', result.schuetzeStammDaten);
    console.log('[Mapper] Mapped verfuegbareSchuetzen output:', result.verfuegbareSchuetzen);
    console.log('[Mapper] Mapped wettkampfInfo output:', result.wettkampfInfo);
    console.log('[Mapper] fromDTO output:', result);
    console.log('=== END MAPPER ===');
    return result;
  }
}
