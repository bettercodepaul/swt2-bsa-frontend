import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SchusszettelService } from '@schusszettel/services/schusszettel.service';
import { TabletSessionSingDO } from '@schusszettel/types/tablet-session-sing-do.class';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'bla-schusszettel-tablet-admin',
  templateUrl: './schusszettel-tablet-admin.component.html',
  styleUrls: ['./schusszettel-tablet-admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchusszettelTabletAdminComponent implements OnInit, OnDestroy {
  /** Array of all team sessions for this Wettkampf */
  public teams: TabletSessionSingDO[] = [];

  /** The Wettkampf ID extracted from the route */
  public wettkampfId!: number;

  /** QR code URL to display in modal */
  public selectedQrUrl: string | null = null;

  /** UI state flags */
  public loading = false;
  public errorMsg: string | null = null;

  /** Subject to clean up subscriptions */
  private destroy$ = new Subject<void>();

  constructor(
    private schussService: SchusszettelService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to paramMap so we react if the route changes without full reload
    this.route.paramMap
        .pipe(takeUntil(this.destroy$))
        .subscribe((params: ParamMap) => {
          const rawId = params.get('wettkampfId');
          if (!rawId || isNaN(+rawId)) {
            console.error('Invalid Wettkampf-ID in URL:', rawId);
            this.errorMsg = 'Ungültige Wettkampf-ID.';
            return;
          }
          this.wettkampfId = +rawId;
          this.loadSessions();
        });
  }

  /**
   * Fetches all sessions for the current Wettkampf from the backend.
   * Shows a loading spinner and handles errors gracefully.
   */
  private loadSessions(): void {
    this.errorMsg = null;
    this.loading  = true;

    this.schussService.getSessions(this.wettkampfId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (sessions) => {
            this.teams   = sessions;
            this.loading = false;
          },
          error: (err) => {
            console.error('Error loading sessions:', err);
            this.errorMsg = 'Fehler beim Laden der Sessions.';
            this.loading  = false;
          }
        });
  }

  /**
   * Called when the user clicks the “Reset Token” button.
   * Invokes the backend to re-tokenize the session, then reloads.
   */
  public resetSession(teamId: number): void {
    this.schussService.resetTabletToken(this.wettkampfId, teamId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            alert('Token successfully reset');
            this.loadSessions();
          },
          error: (err) => {
            console.error('Error resetting token:', err);
            alert('Fehler beim Zurücksetzen des Tokens.');
          }
        });
  }

  /**
   * Generates the full QR-code URL pointing at the tablet entry component.
   * Uses the “schusszettel/tablet” route plus query parameters for token, team, and Wettkampf.
   */
  public getQrUrl(team: TabletSessionSingDO): string {
    const params = new URLSearchParams({
      token:       team.token,
      teamid:      team.teamId.toString(),
      wettkampfid: this.wettkampfId.toString()
    }).toString();

    // Builds a hash‐based URL like: /#/schusszettel/tablet?token=…&teamid=…&wettkampfid=…
    return `${location.origin}/#/schusszettel/tablet?${params}`;
  }

  /** Copies the given text to the clipboard with user feedback */
  public copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text)
             .then(() => alert('Link copied!'))
             .catch((err) => console.error('Copy failed:', err));
  }

  /** Opens the QR modal by setting the selected URL */
  public openQrPopup(url: string): void {
    this.selectedQrUrl = url;
  }

  /** Closes the QR modal */
  public closeQrPopup(): void {
    this.selectedQrUrl = null;
  }

  /**
   * trackBy function to optimize ngFor rendering.
   * Tracks sessions by their teamId.
   */
  public trackByTeam(_: number, team: TabletSessionSingDO): number {
    return team.teamId;
  }

  ngOnDestroy(): void {
    // Signal all subscriptions to complete
    this.destroy$.next();
    this.destroy$.complete();
  }
}
