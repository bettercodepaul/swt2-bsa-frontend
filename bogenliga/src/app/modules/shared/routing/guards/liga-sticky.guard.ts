import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LigaContextService } from '@shared/services/liga-context/liga-context.service';

@Injectable({ providedIn: 'root' })
export class LigaStickyGuard implements CanActivate {

  constructor(private router: Router, private ligaContext: LigaContextService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const preserve = route.data?.['preserveLiga'];
    if (preserve === false) {
      return true;
    }

    const hasLiga = route.queryParamMap.has('liga');
    if (hasLiga) {
      return true;
    }

    const remembered = this.ligaContext.remembered;
    if (remembered?.slug) {
      // Erzeuge neue URL mit liga QueryParam
      return this.router.createUrlTree([state.url.split('?')[0]], {
        queryParams: { liga: remembered.slug }
      });
    }

    return true;
  }
}
