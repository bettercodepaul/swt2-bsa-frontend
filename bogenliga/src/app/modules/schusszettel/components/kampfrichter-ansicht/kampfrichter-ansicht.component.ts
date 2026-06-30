import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {KampfrichterAnsichtService, KampfrichterMatchDO} from '@schusszettel/services/kampfrichter-ansicht.service';

export interface MatchGroup {
  begegnung: number;
  scheiben: KampfrichterMatchDO[];
  expanded: boolean;
}

@Component({
  selector: 'bla-kampfrichter-ansicht',
  templateUrl: './kampfrichter-ansicht.component.html',
  styleUrls: ['./kampfrichter-ansicht.component.scss']
})
export class KampfrichterAnsichtComponent implements OnInit, OnDestroy {

  wettkampfId!: number;
  token!: string;
  matchGroups: MatchGroup[] = [];
  expandedScheiben = new Set<number>();
  loading = false;
  errorMsg: string | null = null;
  savedMatchIds = new Set<number>();

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private kampfrichterService: KampfrichterAnsichtService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.token = params.get('token') ?? '';
        this.wettkampfId = Number(params.get('wettkampfid'));
        if (!this.token || isNaN(this.wettkampfId)) {
          this.errorMsg = 'Ungültige URL-Parameter.';
          return;
        }
        this.loadMatches();
      });
  }

  private loadMatches(): void {
    this.loading = true;
    this.errorMsg = null;
    this.kampfrichterService.getMatches(this.wettkampfId, this.token)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.matchGroups = this.buildGroups(data);
          this.loading = false;
        },
        error: (err) => {
          if (err.status === 401 || err.status === 403) {
            this.errorMsg = 'Kein Zugriff. Bitte öffne den Link über den QR-Code des Wettkampfes.';
          } else {
            this.errorMsg = 'Fehler beim Laden der Matches.';
          }
          this.loading = false;
        }
      });
  }

  private buildGroups(matches: KampfrichterMatchDO[]): MatchGroup[] {
    const map = new Map<number, KampfrichterMatchDO[]>();
    for (const m of matches) {
      if (!map.has(m.begegnung)) {
        map.set(m.begegnung, []);
      }
      map.get(m.begegnung)!.push(m);
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([begegnung, scheiben]) => ({begegnung, scheiben, expanded: false}));
  }

  toggleMatch(group: MatchGroup): void {
    group.expanded = !group.expanded;
  }

  toggleScheibe(matchId: number): void {
    if (this.expandedScheiben.has(matchId)) {
      this.expandedScheiben.delete(matchId);
    } else {
      this.expandedScheiben.add(matchId);
    }
  }

  isScheibeExpanded(matchId: number): boolean {
    return this.expandedScheiben.has(matchId);
  }

  saveStrafpunkte(match: KampfrichterMatchDO): void {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
