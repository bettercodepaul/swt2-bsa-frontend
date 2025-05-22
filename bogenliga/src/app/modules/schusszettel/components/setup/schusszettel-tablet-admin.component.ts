import {Component, Input, OnInit} from '@angular/core';
import {MatchDataProviderService} from '@verwaltung/services/match-data-provider.service';
import {DsbMannschaftDataProviderService} from '@verwaltung/services/dsb-mannschaft-data-provider.service';
import {BogenligaResponse} from '@shared/data-provider/types/bogenliga-response.interface';
import {ActionButtonColors} from '@shared/components/buttons/button/actionbuttoncolors';
import {ActivatedRoute} from '@angular/router';
import { SchusszettelService } from '@schusszettel/services/schusszettel.service';

@Component({
  selector: 'bla-schusszettel-tablet-admin',
  templateUrl: './schusszettel-tablet-admin.component.html',
  styleUrls: ['./schusszettel-tablet-admin.component.scss']
})
export class SchusszettelTabletAdminComponent implements OnInit {
  @Input() wettkampfId!: number;
  public ActionButtonColors = ActionButtonColors;

  teams: { teamId: number; name: string; token: string; status?: string }[] = [];
  selectedQrUrl: string | null = null;
  constructor(
    private matchService: MatchDataProviderService,
    private schusszettelService: SchusszettelService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('wettkampfId');

    if (!id || isNaN(+id)) {
      console.error('Keine oder ungültige Wettkampf-ID in der URL gefunden');
      return;
    }

    this.wettkampfId = +id;
    console.log('Wettkampf-ID geladen:', this.wettkampfId);
    this.loadTeams();
  }

  loadTeams(): void {
    this.schusszettelService.getSessions(this.wettkampfId).subscribe(
      (session) => {
        this.teams = session.map((s) => ({
          teamId: s.teamId,
          name: s.teamName,
          token: s.token,
          status: s.status
          })
        );
      },
      (error) => {
        console.error('Fehler beim Laden der Sessions', error);
      }
    );
  }

  checkToken(teamId: number): string {
    // TODO: echten Token vom Backend holen oder erstellen lassen
    return `mock-${teamId}-${Math.floor(Math.random() * 10000)}`;
  }

  getQrUrl(team: { teamId: number; token: string }): string {
    return `${location.origin}/#/wkdurchfuehrung/tablet?token=${team.token}&teamid=${team.teamId}&wettkampfid=${this.wettkampfId}`;
  }
/*
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
  */

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
