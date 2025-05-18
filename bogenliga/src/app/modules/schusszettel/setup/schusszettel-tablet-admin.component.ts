import { Component, Input, OnInit } from '@angular/core';
import { MatchDataProviderService } from '@verwaltung/services/match-data-provider.service';
import { DsbMannschaftDataProviderService } from '@verwaltung/services/dsb-mannschaft-data-provider.service';
import { MatchDO } from '@verwaltung/types/match-do.class';
import { BogenligaResponse } from '@shared/data-provider/types/bogenliga-response.interface';
import { DsbMannschaftDO } from '@verwaltung/types/dsb-mannschaft-do.class';
import { ActionButtonColors } from '@shared/components/buttons/button/actionbuttoncolors';
import { TabletSessionProviderService } from '@wkdurchfuehrung/services/tablet-session-provider.service';
import { SchusszettelProviderService } from '@wkdurchfuehrung/services/schusszettel-provider.service';

@Component({
  selector: 'bla-schusszettel-tablet-admin',
  templateUrl: './schusszettel-tablet-admin.component.html',
  styleUrls: ['./schusszettel-tablet-admin.component.scss']
})
export class SchusszettelTabletAdminComponent implements OnInit {
  @Input() wettkampfId!: number;
  public ActionButtonColors = ActionButtonColors;

  teams: { teamId: number; name: string; token: string }[] = [];
  selectedQrUrl: string | null = null;
  constructor(
    private matchService: MatchDataProviderService,
    private dsbMannschaftService: DsbMannschaftDataProviderService,
    private tabletSessionService: TabletSessionProviderService,
    private schusszettelService: SchusszettelProviderService
  ) {}

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    this.tabletSessionService.findTeams(this.wettkampfId).then(
      (response: BogenligaResponse<any[]>) => {
        this.teams = response.payload ?? [];
      },
      (error) => {
        console.error('Fehler beim Laden der Teams für Wettkampf', this.wettkampfId, error);
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
      this.schusszettelService.resetTabletToken(this.wettkampfId, teamId).then(
        () => {
          alert('Token wurde erfolgreich zurückgesetzt!');
          this.loadTeams();
        },
        (error) => {
          console.error('Fehler beim Zurücksetzen des Tokens:', error);
        }
      );
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link wurde kopiert!');
    }).catch((err) => {
      console.error('Fehler beim Kopieren', err);
    });
  }

  openQrPopup(url: string): void {
    this.selectedQrUrl = url;
  }

  closeQrPopup(): void {
    this.selectedQrUrl = null;
  }

}
