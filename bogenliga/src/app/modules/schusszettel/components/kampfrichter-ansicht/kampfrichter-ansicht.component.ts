import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
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
          this.matches = data;
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
