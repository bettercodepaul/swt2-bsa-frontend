import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {interval, Subject} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';
import {KampfrichterAnsichtService, KampfrichterMatchDO} from '@schusszettel/services/kampfrichter-ansicht.service';

@Component({
  selector: 'bla-kampfrichter-ansicht',
  templateUrl: './kampfrichter-ansicht.component.html',
  styleUrls: ['./kampfrichter-ansicht.component.scss']
})
export class KampfrichterAnsichtComponent implements OnInit, OnDestroy {

  wettkampfId!: number;
  token!: string;
  matches: KampfrichterMatchDO[] = [];
  loading = false;
  errorMsg: string | null = null;
  lastUpdated: Date | null = null;
  savedMatchIds = new Set<number>();
  matchExpanded = new Map<number, boolean>();

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private kampfrichterService: KampfrichterAnsichtService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const rawWid = params.get('wettkampfid');
        this.token = params.get('token') ?? '';
        this.wettkampfId = Number(rawWid);
        if (!this.token || !rawWid || isNaN(this.wettkampfId) || this.wettkampfId <= 0) {
          this.errorMsg = 'Ungültige URL-Parameter.';
          return;
        }
        this.loadMatches();
        this.startAutoRefresh();
      });
  }

  private startAutoRefresh(): void {
    interval(10000)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.kampfrichterService.getMatches(this.wettkampfId, this.token))
      )
      .subscribe({
        next: (data) => {
          this.mergeMatches(data);
          this.lastUpdated = new Date();
        },
        error: () => { /* silent — error already shown on first load */ }
      });
  }

  private loadMatches(): void {
    this.loading = true;
    this.errorMsg = null;
    this.kampfrichterService.getMatches(this.wettkampfId, this.token)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.mergeMatches(data);
          this.lastUpdated = new Date();
          this.loading = false;
        },
        error: (err) => {
          this.errorMsg = err.status === 403
            ? 'Ungültiger Zugangstoken.'
            : 'Fehler beim Laden der Matches.';
          this.loading = false;
        }
      });
  }

  private mergeMatches(incoming: KampfrichterMatchDO[]): void {
    if (this.matches.length === 0) {
      this.matches = incoming;
      incoming.forEach(m => {
        if (!this.matchExpanded.has(m.matchId)) {
          this.matchExpanded.set(m.matchId, true);
        }
      });
      return;
    }
    // keep edited strafpunkte values unless the backend has newer ones
    incoming.forEach(incomingMatch => {
      const existing = this.matches.find(m => m.matchId === incomingMatch.matchId);
      if (existing) {
        existing.sessionStatus = incomingMatch.sessionStatus;
        // only overwrite strafpunkte when they changed server-side
        if (!this.savedMatchIds.has(incomingMatch.matchId)) {
          existing.strafPunkteSatz1 = incomingMatch.strafPunkteSatz1;
          existing.strafPunkteSatz2 = incomingMatch.strafPunkteSatz2;
          existing.strafPunkteSatz3 = incomingMatch.strafPunkteSatz3;
          existing.strafPunkteSatz4 = incomingMatch.strafPunkteSatz4;
          existing.strafPunkteSatz5 = incomingMatch.strafPunkteSatz5;
        }
      } else {
        this.matches.push(incomingMatch);
        this.matchExpanded.set(incomingMatch.matchId, true);
      }
    });
    this.savedMatchIds.clear();
  }

  isMeldungFehlt(match: KampfrichterMatchDO): boolean {
    return match.sessionStatus === 'SCHUETZENMELDUNG' || match.sessionStatus === 'UNBEKANNT';
  }

  toggleExpanded(matchId: number): void {
    this.matchExpanded.set(matchId, !this.matchExpanded.get(matchId));
  }

  isExpanded(matchId: number): boolean {
    return this.matchExpanded.get(matchId) ?? true;
  }

  saveStrafpunkteOnBlur(match: KampfrichterMatchDO): void {
    this.kampfrichterService.updateStrafpunkte(this.wettkampfId, this.token, {
      matchId: match.matchId,
      strafPunkteSatz1: match.strafPunkteSatz1 ?? 0,
      strafPunkteSatz2: match.strafPunkteSatz2 ?? 0,
      strafPunkteSatz3: match.strafPunkteSatz3 ?? 0,
      strafPunkteSatz4: match.strafPunkteSatz4 ?? 0,
      strafPunkteSatz5: match.strafPunkteSatz5 ?? 0
    }).pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => this.savedMatchIds.add(match.matchId),
        error: () => alert('Fehler beim Speichern der Strafpunkte.')
      });
  }

  getSatz(match: KampfrichterMatchDO, satz: number): number {
    switch (satz) {
      case 1: return match.strafPunkteSatz1 ?? 0;
      case 2: return match.strafPunkteSatz2 ?? 0;
      case 3: return match.strafPunkteSatz3 ?? 0;
      case 4: return match.strafPunkteSatz4 ?? 0;
      case 5: return match.strafPunkteSatz5 ?? 0;
      default: return 0;
    }
  }

  setSatz(match: KampfrichterMatchDO, satz: number, value: number): void {
    switch (satz) {
      case 1: match.strafPunkteSatz1 = value; break;
      case 2: match.strafPunkteSatz2 = value; break;
      case 3: match.strafPunkteSatz3 = value; break;
      case 4: match.strafPunkteSatz4 = value; break;
      case 5: match.strafPunkteSatz5 = value; break;
    }
  }

  matchesByScheibe(): KampfrichterMatchDO[] {
    return [...this.matches].sort((a, b) =>
      (a.matchScheibennummer ?? 0) - (b.matchScheibennummer ?? 0)
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
