import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {SchusszettelService} from '@schusszettel/services/schusszettel.service';
import {KampfrichterAnsichtService} from '@schusszettel/services/kampfrichter-ansicht.service';
import {TabletSessionSingDO} from '@schusszettel/types/tablet-session-sing-do.class';
import {WettkampfInfoDTO} from '@schusszettel/types/inside/wettkampf-info-dto';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {faQrcode, faTrash} from '@fortawesome/free-solid-svg-icons';
import {FaIconLibrary} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'bla-schusszettel-tablet-admin',
  templateUrl: './schusszettel-tablet-admin.component.html',
  styleUrls: ['./schusszettel-tablet-admin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchusszettelTabletAdminComponent implements OnInit, OnDestroy {
  /** List of team session entries for the current Wettkampf */
  public teams: TabletSessionSingDO[] = [];

  /** Identifier for the current Wettkampf */
  public wettkampfId!: number;

  /** Wettkampf information extracted from first team session */
  public wettkampfInfo: WettkampfInfoDTO | null = null;

  /** URL for displaying QR code in the modal */
  public selectedQrUrl: string | null = null;

  /** Kampfrichter token and QR URL */
  public kampfrichterToken: string | null = null;
  public kampfrichterQrUrl: string | null = null;

  /** Flags for tracking UI state */
  public loading = false;
  public errorMsg: string | null = null;

  /** FontAwesome icons */
  public faTrash = faTrash;
  public faQrcode = faQrcode;

  /** Subject used to unsubscribe from observables on destroy */
  private destroy$ = new Subject<void>();

  constructor(
    private schussService: SchusszettelService,
    private kampfrichterService: KampfrichterAnsichtService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef,
    private iconLibrary: FaIconLibrary
  ) {
    this.iconLibrary.addIcons(faTrash, faQrcode);
  }

  /**
   * Initializes component by subscribing to route parameters
   * and triggering session load when Wettkampf ID changes.
   */
  ngOnInit(): void {
    console.log('[SchusszettelAdmin] ngOnInit, URL:', this.router.url);
    this.route.paramMap
        .pipe(takeUntil(this.destroy$))
        .subscribe((params: ParamMap) => {
          const rawId = params.get('wettkampfId');
          if (!rawId || isNaN(+rawId)) {
            console.error('[SchusszettelAdmin] Invalid Wettkampf-ID:', rawId);
            this.errorMsg = 'Ungültige Wettkampf-ID.';
            return;
          }
          this.wettkampfId = +rawId;
          this.loadSessions();
        });
  }

  /**
   * Requests session data from backend and updates UI state.
   */
  private loadSessions(): void {
    console.log('[SchusszettelAdmin] loadSessions for:', this.wettkampfId);
    this.errorMsg = null;
    this.loading = true;
    this.cd.markForCheck();

    this.schussService.getSessions(this.wettkampfId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (sessions) => {
            this.teams = sessions;
            if (sessions.length > 0 && sessions[0].wettkampfInfo) {
              this.wettkampfInfo = sessions[0].wettkampfInfo;
            }
            this.loading = false;
            this.cd.markForCheck();
          },
          error: (err) => {
            console.error('[SchusszettelAdmin] loadSessions error:', err);
            if (err.status === 404) {
              this.errorMsg = 'Das System hat keine Begegnungen für diesen Wettkampf gefunden. Stellen Sie sicher, dass Sie die Matches gegeneriert haben, bevor Sie die Schusszettel Tablet Sessions ausgeben.';
            } else {
              this.errorMsg = 'Fehler beim Laden der Sessions.';
            }
            this.loading = false;
            this.cd.markForCheck();
          }
        });

    this.kampfrichterService.getOrCreateToken(this.wettkampfId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            this.kampfrichterToken = resp.token;
            this.kampfrichterQrUrl = this.buildKampfrichterUrl(resp.token);
            this.cd.markForCheck();
          },
          error: (err) => console.warn('[SchusszettelAdmin] kampfrichter token error:', err)
        });
  }

  public buildKampfrichterUrl(token: string): string {
    const params = new URLSearchParams({
      token,
      wettkampfid: this.wettkampfId.toString()
    }).toString();
    return `${location.origin}/#/schusszettel/kampfrichter?${params}`;
  }

  /**
   * Resets the token for a given team and reloads sessions.
   * @param teamId - identifier of the team to reset
   */
  public resetSession(teamId: number): void {
    console.log('[SchusszettelAdmin] resetSession', teamId, this.wettkampfId);
    this.schussService.resetTabletToken(this.wettkampfId, teamId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            alert('Token erfolgreich zurückgesetzt');
            this.loadSessions();
          },
          error: (err) => {
            console.error('[SchusszettelAdmin] resetSession error:', err);
            alert('Fehler beim Zurücksetzen des Tokens.');
          }
        });
  }

  /**
   * Constructs the QR code URL for a session entry.
   * @param team - session data for the team
   * @returns full URL string for QR code
   */
  public getQrUrl(team: TabletSessionSingDO): string {
    const params = new URLSearchParams({
      token: team.token,
      teamid: team.teamId.toString(),
      wettkampfid: this.wettkampfId.toString()
    }).toString();
    return `${location.origin}/#/schusszettel/tablet?${params}`;
  }

  /**
   * Opens the QR modal by setting the URL
   */
  public openQrPopup(url: string): void {
    this.selectedQrUrl = url;
  }

  /**
   * Closes the QR modal
   */
  public closeQrPopup(): void {
    this.selectedQrUrl = null;
  }

  /**
   * trackBy function for ngFor to optimize rendering
   */
  public trackByTeam(_: number, team: TabletSessionSingDO): number {
    return team.teamId;
  }

  /** Unsubscribes all active streams on component destroy */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /** Copies text to clipboard with console feedback */
  public copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text)
             .then(() => console.log('[SchusszettelAdmin] text copied'))
             .catch((err) => console.error('[SchusszettelAdmin] copy failed:', err));
  }
}
