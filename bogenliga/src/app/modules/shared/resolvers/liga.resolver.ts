import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree
} from '@angular/router';
import { CurrentLigaService } from '@shared/services/current-liga/current-liga.service';
import { LigaDataProviderService } from '@verwaltung/services/liga-data-provider.service';
import { LigaDO } from '@verwaltung/types/liga-do.class';

/**
 * LigaResolver
 *
 * Lädt vor dem Aktivieren einer Route die gewünschte Liga (entweder numeric id oder name/slug).
 * - Bei numeric: ruft ligaProvider.findById(id) auf
 * - Bei non-numeric: ruft ligaProvider.checkExists(param) auf (Backend erwartet checkExist/:param)
 *
 * Wenn die Liga erfolgreich geladen wurde, wird CurrentLigaService.setLiga(...) aufgerufen.
 * Bei Fehler oder nicht existentem Eintrag wird zu '/' (anpassbar) umgeleitet.
 */
@Injectable({
  providedIn: 'root'
})
export class LigaResolver implements Resolve<boolean | UrlTree> {

  constructor(
    private currentLiga: CurrentLigaService,
    private ligaProvider: LigaDataProviderService,
    private router: Router
  ) {}

  async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
    const param = route.paramMap.get('ligaId');

    if (!param) {
      // Keine Liga in URL -> redirect zur Auswahl/Home
      return this.router.parseUrl('/');
    }

    // Prüfen, ob der Parameter eine reine Zahl ist (z. B. "42")
    const numeric = Number(param);
    try {
      let liga: LigaDO | undefined;

      if (!isNaN(numeric) && String(numeric) === param) {
        // numeric id
        const resp = await this.ligaProvider.findById(numeric);
        liga = resp.payload;
      } else {
        // name/slug: backend-endpoint 'checkExist' wird erwartet
        const resp = await this.ligaProvider.checkExists(param);
        liga = resp.payload;
      }

      if (!liga) {
        // Falls das Backend ein leeres payload zurückgibt
        return this.router.parseUrl('/');
      }

      // Setze den globalen Liga-Kontext
      this.currentLiga.setLiga(liga);

      // Erfolgreich geladen -> Route zulassen
      return true;
    } catch (error) {
      // Fehler beim Laden (nicht existierend / connection problem / etc.) -> redirect
      return this.router.parseUrl('/');
    }
  }
}
