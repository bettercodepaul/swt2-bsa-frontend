// tablet.component.ts - Modified to include zustand flow
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SchusszettelService } from '../../services/schusszettel.service';
import { TabletSchusszettel} from '../../models/tablet-schusszettel.model';
import { SchuetzenSatzDTO } from '../../types/datatransfer/satz-eingabe-dto';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {TabletSchusszettelStatus} from '@schusszettel/types/tablet-schusszettel-dto';

interface TabletState {
  showZustand: boolean;
  targetComponent: 'SCHUETZENMELDUNG' | 'SATZEINGABE' | null;
  actualStatus: TabletSchusszettelStatus;
}

@Component({
  selector: 'bla-tablet',
  templateUrl: './tablet.component.html',
  styleUrls: ['./tablet.component.scss']
})
export class TabletComponent implements OnInit, OnDestroy {
  token!: string;
  teamId!: number;
  wettkampfId!: number;
  data?: TabletSchusszettel;

  loading = false;
  errorMsg: string | null = null;

  // State management for zustand flow
  private tabletState: TabletState = {
    showZustand: false,
    targetComponent: null,
    actualStatus: null
  };

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private schussService: SchusszettelService
  ) {}

  ngOnInit(): void {
    console.log('[Tablet] Component initializing...');

    this.route.queryParamMap
        .pipe(takeUntil(this.destroy$))
        .subscribe((params) => {
          this.token = params.get('token')!;
          this.teamId = Number(params.get('teamid'));
          this.wettkampfId = Number(params.get('wettkampfid'));

          console.log(`[Tablet] Initialized with params: wettkampfId=${this.wettkampfId}, teamId=${this.teamId}`);

          // Initialize session tracking
          this.initializeSessionTracking();

          this.load();
        });
  }

  private initializeSessionTracking(): void {
    // Set up session tracking for this tablet instance
    const sessionKey = `tablet_session_${this.wettkampfId}_${this.teamId}`;
    const sessionStartTime = new Date().toISOString();

    sessionStorage.setItem(sessionKey, sessionStartTime);
    sessionStorage.setItem(`${sessionKey}_token`, this.token);

    console.log(`[Tablet] Session tracking initialized at ${sessionStartTime}`);
  }

  load(): void {
    if (!this.token || isNaN(this.teamId) || isNaN(this.wettkampfId)) {
      this.errorMsg = 'Ungültige URL-Parameter.';
      return;
    }

    this.loading = true;
    this.errorMsg = null;

    console.log(`[Tablet] Loading data for wettkampfId=${this.wettkampfId}, teamId=${this.teamId}`);

    this.schussService
        .getSchusszettel(this.token, this.wettkampfId, this.teamId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            console.log(`[Tablet] Received data with status: ${resp.status}`);
            this.data = resp;
            this.handleStatusChange(resp.status);
            this.loading = false;

            // Log current session state for debugging
            if (console.groupCollapsed) {
              console.groupCollapsed('[Tablet] Session State after load');
              console.log('Current zustand session info:', this.getZustandSessionInfo());
              console.groupEnd();
            }
          },
          error: (err) => {
            console.error('[Tablet] Fehler beim Laden:', err);
            this.errorMsg = 'Daten konnten nicht geladen werden. Bitte später erneut versuchen.';
            this.loading = false;
          }
        });
  }

  private handleStatusChange(newStatus: TabletSchusszettelStatus): void {
    console.log(`[Tablet] Handling status change to: ${newStatus}`);

    // Check if we should show zustand first
    if (this.shouldShowZustand(newStatus)) {
      console.log('[Tablet] Showing zustand before main component');
      this.tabletState = {
        showZustand: true,
        targetComponent: newStatus as 'SCHUETZENMELDUNG' | 'SATZEINGABE',
        actualStatus: newStatus
      };
    } else {
      console.log('[Tablet] Proceeding directly to main component');
      this.tabletState = {
        showZustand: false,
        targetComponent: null,
        actualStatus: newStatus
      };
    }

    console.log('[Tablet] New tablet state:', this.tabletState);
  }

  private shouldShowZustand(status: TabletSchusszettelStatus): boolean {
    // Show zustand before SCHUETZENMELDUNG or SATZEINGABE
    const isTargetStatus = (
      status === TabletSchusszettelStatus.SCHUETZENMELDUNG ||
      status === TabletSchusszettelStatus.SATZEINGABE
    );

    if (!isTargetStatus) {
      console.log(`[Tablet] Status ${status} does not require zustand`);
      return false;
    }

    const hasSeenZustand = this.hasSeenZustandForCurrentSession();
    console.log(`[Tablet] Status ${status} requires zustand. Already seen: ${hasSeenZustand}`);

    return !hasSeenZustand;
  }

  private hasSeenZustandForCurrentSession(): boolean {
    // Track if zustand was already shown for this specific status and session
    const key = `zustand_seen_${this.wettkampfId}_${this.teamId}_${this.data?.status}`;
    const lastShown = sessionStorage.getItem(key);

    // Also check if this is a page reload - if so, we might want to show zustand again
    const pageLoadKey = `page_load_${this.wettkampfId}_${this.teamId}`;
    const isNewPageLoad = !sessionStorage.getItem(pageLoadKey);

    if (isNewPageLoad) {
      sessionStorage.setItem(pageLoadKey, 'true');
      // Clear previous zustand state on new page load to ensure zustand is shown
      sessionStorage.removeItem(key);
      return false;
    }

    return lastShown === 'true';
  }

  private markZustandAsSeen(): void {
    const key = `zustand_seen_${this.wettkampfId}_${this.teamId}_${this.data?.status}`;
    const timestamp = new Date().toISOString();

    // Store both the seen flag and timestamp
    sessionStorage.setItem(key, 'true');
    sessionStorage.setItem(`${key}_timestamp`, timestamp);

    console.log(`[Tablet] Zustand marked as seen for status: ${this.data?.status} at ${timestamp}`);
  }

  getCurrentDisplayMode(): string {
    if (this.tabletState.showZustand) {
      return 'ZUSTAND';
    }
    return this.tabletState.actualStatus || this.data?.status || 'UNKNOWN';
  }

  onZustandWeiter(): void {
    console.log('[Tablet] Zustand "Weiter" clicked');

    // Mark zustand as seen and proceed to target component
    this.markZustandAsSeen();
    this.tabletState.showZustand = false;

    console.log('[Tablet] Proceeding to target component:', this.tabletState.targetComponent);
  }

  onRegister(meldungen: number[]): void {
    console.log('[Tablet] Registering shooters:', meldungen);

    // Clear zustand state when submitting
    this.clearZustandState();

    this.schussService
        .postSchuetzenMeldung(this.token, this.wettkampfId, this.teamId, meldungen)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('[Tablet] Registration successful, reloading...');
            this.load();
          },
          error: (err) => {
            console.error('[Tablet] Registrierungsfehler:', err);
          }
        });
  }

  onSatz(satzeingabe: SchuetzenSatzDTO[]): void {
    console.log('[Tablet] Submitting satz data:', satzeingabe);

    // Clear zustand state when submitting
    this.clearZustandState();

    this.schussService
        .postSatzEingabe(this.token, this.wettkampfId, this.teamId, satzeingabe)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log('[Tablet] Satz submission successful, reloading...');
            this.load();
          },
          error: (err) => {
            console.error('[Tablet] Eingabefehler:', err);
          }
        });
  }

  private clearZustandState(): void {
    // Clear session storage when submitting data to ensure fresh state for next status
    const currentKey = `zustand_seen_${this.wettkampfId}_${this.teamId}_${this.data?.status}`;
    const timestampKey = `${currentKey}_timestamp`;

    sessionStorage.removeItem(currentKey);
    sessionStorage.removeItem(timestampKey);

    // Also clear any related keys for this wettkampf/team combination
    this.clearRelatedZustandKeys();

    console.log(`[Tablet] Cleared zustand state for status: ${this.data?.status}`);
  }

  private clearRelatedZustandKeys(): void {
    // Clear all zustand-related keys for this session to ensure clean state
    const keysToRemove: string[] = [];

    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.includes(`zustand_seen_${this.wettkampfId}_${this.teamId}`)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      sessionStorage.removeItem(key);
      console.log(`[Tablet] Removed session key: ${key}`);
    });
  }

  /**
   * Method to force reset zustand state - for debugging or manual reset
   */
  public resetZustandState(): void {
    this.clearRelatedZustandKeys();
    const pageLoadKey = `page_load_${this.wettkampfId}_${this.teamId}`;
    sessionStorage.removeItem(pageLoadKey);
    console.log('[Tablet] Zustand state force reset');
  }

  /**
   * Method to check current zustand session state - for debugging
   */
  public getZustandSessionInfo(): any {
    const info = {
      wettkampfId: this.wettkampfId,
      teamId: this.teamId,
      currentStatus: this.data?.status,
      tabletState: this.tabletState,
      sessionKeys: {} as any
    };

    // Collect all relevant session storage keys
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.includes(`zustand_seen_${this.wettkampfId}_${this.teamId}`) ||
        key.includes(`page_load_${this.wettkampfId}_${this.teamId}`))) {
        info.sessionKeys[key] = sessionStorage.getItem(key);
      }
    }

    return info;
  }

  ngOnDestroy(): void {
    console.log('[Tablet] Component destroying, cleaning up...');

    // Clean up subscriptions
    this.destroy$.next();
    this.destroy$.complete();

    this.clearRelatedZustandKeys();

    console.log('[Tablet] Component cleanup complete');
  }
}
