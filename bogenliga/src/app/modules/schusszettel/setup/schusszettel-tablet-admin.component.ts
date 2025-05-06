import { Component, Input, OnInit } from '@angular/core';
import { MatchDataProviderService } from '@verwaltung/services/match-data-provider.service';
import { DsbMannschaftDataProviderService } from '@verwaltung/services/dsb-mannschaft-data-provider.service';
import { MatchDO } from '@verwaltung/types/match-do.class';
import { BogenligaResponse } from '@shared/data-provider/types/bogenliga-response.interface';
import { DsbMannschaftDO } from '@verwaltung/types/dsb-mannschaft-do.class';

@Component({
  selector: 'bla-schusszettel-tablet-admin',
  templateUrl: './schusszettel-tablet-admin.component.html',
  styleUrls: ['./schusszettel-tablet-admin.component.scss']
})
export class SchusszettelTabletAdminComponent implements OnInit {
  @Input() wettkampfId!: number;

  teams: { teamId: number; name: string; token: string }[] = [];

  constructor(
    private matchService: MatchDataProviderService,
    private dsbMannschaftService: DsbMannschaftDataProviderService
  ) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.matchService.findAllWettkampfMatchesById(this.wettkampfId).then(
      async (response: BogenligaResponse<MatchDO[]>) => {
        const matches = response.payload ?? [];
        const seenTeamIds = new Set<number>();
        const teamsMap = new Map<number, string>(); // teamId -> teamName
        const teamsList: { teamId: number; name: string; token: string }[] = [];

        for (const match of matches) {
          const teamId = match.mannschaftId;

          if (!seenTeamIds.has(teamId)) {
            seenTeamIds.add(teamId);

            try {
              const teamResponse = await this.dsbMannschaftService.findById(teamId);
              const teamName = teamResponse.payload?.name ?? `Team ${teamId}`;

              teamsMap.set(teamId, teamName);

              teamsList.push({
                teamId,
                name: teamName,
                token: this.checkToken(teamId)
              });

            } catch (error) {
              console.warn(`Team ${teamId} konnte nicht geladen werden`, error);
            }
          }
        }

        this.teams = teamsList;
      },
      (error) => {
        console.error('Fehler beim Laden der Matches für Wettkampf', this.wettkampfId, error);
      }
    );
  }

  checkToken(teamId: number): string {
    // TODO: echten Token vom Backend holen oder erstellen lassen
    return `mock-${teamId}-${Math.floor(Math.random() * 10000)}`;
  }

  getQrUrl(team: { teamId: number; token: string }): string {
    return `${location.origin}/schusszettel/setup?token=${team.token}`;
  }

  resetSession(teamId: number): void {
    // TODO: Token beim Backend zurücksetzen
    alert(`(Mock) Session for team ${teamId} reset.`);
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link wurde kopiert!');
    }).catch((err) => {
      console.error('Fehler beim Kopieren', err);
    });
  }

}
