import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {TabletSchusszettel} from '../../models/tablet-schusszettel.model';
import {AppComponent} from 'src/app/app.component';

@Component({
  selector: 'bla-maske6matchende',
  templateUrl: './maske6matchende.component.html',
  styleUrls: ['./maske6matchende.component.scss']
})
export class Maske6MatchendeComponent implements OnInit, OnDestroy {
  /** full tablet state; wait for it via *ngIf */
  @Input() infos: TabletSchusszettel | null = null;

  /** fires when "Weiter" is clicked */
  @Output() weiter = new EventEmitter<void>();

  constructor(private app: AppComponent) {}

  ngOnInit(): void {
    this.app.fullscreen = true; //  Navbar und Footer ausblenden
  }

  ngOnDestroy(): void {
    this.app.fullscreen = false; //  Beim Verlassen wieder anzeigen
  }

  onWeiter(): void {
    this.weiter.emit();
  }

  /** Check if we should show the embedded wkdurchfuehrung schusszettel component */
  shouldShowSchusszettel(): boolean {
    return !!(this.infos?.eigenesTeamMatchId && this.infos?.gegnerischesTeamMatchId);
  }

  /** Get match result summary for display */
  getMatchResultSummary(): string {
    if (!this.infos?.matchErgebnis || this.infos.matchErgebnis.length < 2) {
      return 'Match-Ergebnis wird geladen...';
    }

    const ownTeam = this.infos.matchErgebnis.find((m) => m.teamId === this.infos?.eigenesTeam?.teamId);
    const opponentTeam = this.infos.matchErgebnis.find((m) => m.teamId === this.infos?.gegnerischesTeam?.teamId);

    if (!ownTeam || !opponentTeam) {
      return 'Match-Ergebnis nicht verfügbar';
    }

    const ownTeamName = this.infos.eigenesTeam?.teamName || `Team ${ownTeam.teamId}`;
    const opponentTeamName = this.infos.gegnerischesTeam?.teamName || `Team ${opponentTeam.teamId}`;

    return `${ownTeamName}: ${ownTeam.matchpunkte} - ${opponentTeamName}: ${opponentTeam.matchpunkte} Satzpunkte`;
  }

  /** Get winner information for display */
  getWinnerInfo(): { hasWinner: boolean; winnerName: string; isDraw: boolean } {
    if (!this.infos?.matchErgebnis || this.infos.matchErgebnis.length < 2) {
      return { hasWinner: false, winnerName: '', isDraw: false };
    }

    const ownTeam = this.infos.matchErgebnis.find((m) => m.teamId === this.infos?.eigenesTeam?.teamId);
    const opponentTeam = this.infos.matchErgebnis.find((m) => m.teamId === this.infos?.gegnerischesTeam?.teamId);

    if (!ownTeam || !opponentTeam) {
      return { hasWinner: false, winnerName: '', isDraw: false };
    }

    if (ownTeam.matchpunkte > opponentTeam.matchpunkte) {
      return {
        hasWinner: true,
        winnerName: this.infos.eigenesTeam?.teamName || `Team ${ownTeam.teamId}`,
        isDraw: false
      };
    } else if (opponentTeam.matchpunkte > ownTeam.matchpunkte) {
      return {
        hasWinner: true,
        winnerName: this.infos.gegnerischesTeam?.teamName || `Team ${opponentTeam.teamId}`,
        isDraw: false
      };
    } else {
      return { hasWinner: true, winnerName: 'Unentschieden', isDraw: true };
    }
  }

  /** Get number of completed sets */
  getCompletedSetsCount(): number {
    if (!this.infos?.satzErgebnisse) {
      return 0;
    }
    return this.infos.satzErgebnisse.filter((s) => s.team1Punkte > 0 || s.team2Punkte > 0).length;
  }
}
