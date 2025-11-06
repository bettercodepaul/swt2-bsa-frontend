import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { CurrentLigaService } from '@shared/services/current-liga';

@Injectable()
export class CurrentLigaGuard implements CanActivate {
  constructor(private currentLiga: CurrentLigaService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const param = route.paramMap.get('ligaId');
    if (!param) {
      return this.router.parseUrl('/home'); // besser explizite Info-Seite
    }

    const numeric = Number(param);
    try {
      if (!isNaN(numeric) && String(numeric) === param) {
        await this.currentLiga.setLigaById(numeric);
      } else {
        await this.currentLiga.setLigaBySlug(param);
      }
      return true;
    } catch {
      return this.router.parseUrl('/home');
    }
  }
}
