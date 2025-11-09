import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { CurrentLigaService } from '@shared/services/current-liga';

/**
 * Dünner Guard:
 * - Erwartet Route-Param 'id' im Format "<zahl>" oder "<zahl>-<slug>"
 * - Extrahiert nur die numerische ID vor dem ersten '-' und setzt den Liga-Kontext
 * - Keine Slug-Validierung/Canonical-Redirects (das erledigt die HomeComponent)
 * - Bei fehlender/ungültiger ID: Redirect auf '/home'
 */
@Injectable()
export class CurrentLigaGuard implements CanActivate {
  constructor(
    private currentLiga: CurrentLigaService,
    private router: Router
  ) {}

  async canActivate(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const raw = route.paramMap.get('id'); // Route: path: 'home/:id'
    if (!raw) {
      return this.router.parseUrl('/home');
    }

    // Nimmt nur den Teil vor dem ersten '-' als numerische ID
    const idPart = raw.split('-')[0];
    const idNum = Number(idPart);

    if (isNaN(idNum) || idPart !== String(idNum)) {
      return this.router.parseUrl('/home');
    }

    try {
      // Setzt die Liga global; Service cached identische IDs selbst
      await this.currentLiga.setLigaById(idNum);
      return true;
    } catch {
      return this.router.parseUrl('/home');
    }
  }
}
