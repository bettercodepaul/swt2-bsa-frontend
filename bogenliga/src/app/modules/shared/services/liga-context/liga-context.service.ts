import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith, distinctUntilChanged } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LigaDO } from '@verwaltung/types/liga-do.class';
import { slugifyLigaName } from '@shared/functions/slug-utils';
import { RecentLigaService } from '@shared/services/recent-liga/recent-liga.service';
import {RememberedLigaService} from "@shared/services/remembered-liga/remembered-liga.service";

@Injectable({ providedIn: 'root' })
export class LigaContextService {
  readonly currentLiga$: Observable<LigaDO | null>;
  private currentLigaSnapshot: LigaDO | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private recentLiga: RecentLigaService,
    private rememberedLiga: RememberedLigaService
  ) {
    this.currentLiga$ = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      startWith(null),
      map(() => this.getDeepestChild(this.route)),
      map(r => (r?.snapshot.data?.['liga'] as LigaDO | null) ?? null),
      distinctUntilChanged((a, b) => a?.id === b?.id)
    );

    this.currentLiga$.subscribe(liga => {
      this.currentLigaSnapshot = liga;
      if (liga && liga.id != null) {
        const slug = slugifyLigaName(liga.name ?? '') || String(liga.id);
        this.recentLiga.add({ id: liga.id, name: liga.name ?? '', slug });
        this.rememberedLiga.set({ id: liga.id, name: liga.name ?? '', slug });
      }
    });
  }

  get remembered(): { id: number; name: string; slug: string } | null {
    return this.rememberedLiga.get();
  }

  /**
   * Baut kanonischen Home-Link für die aktuelle oder übergebene Liga (QueryParam-Format).
   */
  buildHomeLink(liga?: LigaDO): { commands: any[]; queryParams?: any } {
    const useLiga = liga ?? this.currentLigaSnapshot;
    if (useLiga && useLiga.id != null) {
      const slug = slugifyLigaName(useLiga.name ?? '') || String(useLiga.id);
      return { commands: ['/home'], queryParams: { liga: slug } };
    }
    return { commands: ['/home'] };
  }

  /**
   * Allgemeiner Helper: Baut einen Link für beliebige Route (commands),
   * hängt liga-Param an, falls vorhanden und notSticky nicht true.
   */
  buildCommandsWithLiga(commands: any[], notSticky = false): { commands: any[]; queryParams?: any } {
    if (notSticky) return { commands };
    const active = this.currentLigaSnapshot;
    const remembered = this.rememberedLiga.get();
    const source = active?.id != null ? active : remembered;
    if (source?.id != null) {
      const slug = slugifyLigaName(source.name ?? '') || String(source.id);
      return { commands, queryParams: { liga: slug } };
    }
    return { commands };
  }

  navigateToHome(liga?: LigaDO): void {
    const link = this.buildHomeLink(liga);
    this.router.navigate(link.commands, { queryParams: link.queryParams });
  }

  clearRemembered(): void {
    this.rememberedLiga.clear();
  }

  private getDeepestChild(r: ActivatedRoute): ActivatedRoute {
    while (r.firstChild) r = r.firstChild;
    return r;
  }
}
