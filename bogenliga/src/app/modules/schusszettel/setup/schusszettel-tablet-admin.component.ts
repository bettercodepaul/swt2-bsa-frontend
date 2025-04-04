import { Component, Input, OnInit } from '@angular/core';
import { MatchDataProviderService } from '@verwaltung/services/match-data-provider.service';

@Component({
  selector: 'bla-schusszettel-tablet-admin',
  templateUrl: './schusszettel-tablet-admin.component.html',
  styleUrls: ['./schusszettel-tablet-admin.component.scss']
})
export class SchusszettelTabletAdminComponent implements OnInit {
  @Input() wettkampfId!: number;

  teams: { teamId: number; name: string; token: string }[] = [];

  constructor(private matchService: MatchDataProviderService) {}

  ngOnInit(): void {
    this.loadTeamsFromMatches();
  }

  loadTeamsFromMatches(): void {
    this.matchService.findAllWettkampfMatchesById(this.wettkampfId).then(response => {
      const matches = response.result;
      const seen = new Set<number>();
      const uniqueTeams: { teamId: number; name: string; token: string }[] = [];

      for (const match of matches) {
        if (!seen.has(match.teamIdA)) {
          seen.add(match.teamIdA);
          uniqueTeams.push({
            teamId: match.teamIdA,
            name: match.teamNameA,
            token: this.generateMockToken(match.teamIdA)
          });
        }
        if (!seen.has(match.teamIdB)) {
          seen.add(match.teamIdB);
          uniqueTeams.push({
            teamId: match.teamIdB,
            name: match.teamNameB,
            token: this.generateMockToken(match.teamIdB)
          });
        }
      }

      this.teams = uniqueTeams;
    });
  }

  generateMockToken(teamId: number): string {
    // TODO, check if token exists in backend, get it, or create a new one
    return `mock-${teamId}-${Math.floor(Math.random() * 10000)}`;
  }

  getQrUrl(team: { teamId: number; token: string }): string {
    return `${location.origin}/schusszettel/setup?token=${team.token}`;
  }

  resetSession(teamId: number): void {
    // TODO, tell backend to delete and create new token for team in this wettkampf, and return it
    alert(`(Mock) Session for team ${teamId} reset.`);
  }
}

