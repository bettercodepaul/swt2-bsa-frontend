import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith, distinctUntilChanged } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LigaDO } from '@verwaltung/types/liga-do.class';
import { slugifyLigaName } from '@shared/functions/slug-utils';
import { RecentLigaService } from '@shared/services/recent-liga/recent-liga.service';

@Injectable({ providedIn: 'root' })
export class LigaContextService {
  readonly currentLiga$: Observable<LigaDO | null>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private recentLiga: RecentLigaService
  ) {
    this.currentLiga$ = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.getDeepestChild(this.route)),
      map(r => (r?.snapshot.data?.['liga'] as LigaDO | null) ?? null),
      distinctUntilChanged((a, b) => a?.id === b?.id)
    );

    // Update „recent“ beim Wechsel
    this.currentLiga$.subscribe(liga => {
      if (liga && liga.id != null) {
        this.recentLiga.add({
          id: liga.id,
          name: liga.name ?? '',
          slug: slugifyLigaName(liga.name ?? '') || String(liga.id)
        });
      }
    });
  }

  buildHomeLink(liga: LigaDO): string {
    const slug = slugifyLigaName(liga.name ?? '') || liga.id;
    return `/home/liga=${slug}`;
  }

  buildTabelleLink(liga: LigaDO): string {
    const slug = slugifyLigaName(liga.name ?? '') || liga.id;
    return `/tabelle/liga=${slug}`;
  }

  navigateToHome(liga: LigaDO): void {
    this.router.navigateByUrl(this.buildHomeLink(liga));
  }

  private getDeepestChild(r: ActivatedRoute): ActivatedRoute {
    while (r.firstChild) r = r.firstChild;
    return r;
  }
}
