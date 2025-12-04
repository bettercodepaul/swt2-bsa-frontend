import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { LigaDataProviderService } from '@verwaltung/services/liga-data-provider.service';
import { LigaDO } from '@verwaltung/types/liga-do.class';
import { BogenligaResponse } from '@shared/data-provider';
import { LoginDataProviderService } from '@user/services/login-data-provider.service';
import {CurrentUserService, ErrorHandlingService} from '@shared/services';
import { RememberedLiga, RememberedLigaService } from '@shared/services/remembered-liga/remembered-liga.service';
import { slugifyLigaName } from '@shared/functions/slug-utils';

/**
 * Lädt eine Liga anhand eines Query-Params (?liga=).
 * Verhalten:
 * - Kein Param: Kontext leeren, null zurück
 * - Param ungültig: Kontext leeren, Redirect zu /home (ohne Param)
 * - Param gültig aber nicht kanonisch (z.B. falsche Großschreibung): Redirect auf kanonische URL (?liga=kanonisch)
 * - Param gültig: Liga im Remembered-Service speichern, LigaDO zurückgeben
 */
@Injectable({ providedIn: 'root' })
export class LigaResolver implements Resolve<LigaDO | null> {
  constructor(
    private ligaProvider: LigaDataProviderService,
    private loginProvider: LoginDataProviderService,
    private currentUser: CurrentUserService,
    private rememberedLiga: RememberedLigaService,
    private router: Router,
    private errorHandlingService: ErrorHandlingService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<LigaDO | null> {
    // Login sicherstellen bevor Liga geladen wird (falls nötig)
    if (!this.currentUser.isLoggedIn()) {
      try {
        await this.loginProvider.signInDefaultUser();
      } catch (e) {
        console.warn('LigaResolver: Default-Login fehlgeschlagen', e);
      }
    }

    // Unterscheiden zwischen "kein Param vorhanden" und "Param vorhanden aber leer"
    const hasLigaParam = route.queryParamMap.has('liga');
    let raw = route.queryParamMap.get('liga');

    // Param fehlt komplett -> Kontext leeren, auf /home bleiben
    if (!hasLigaParam) {
      this.rememberedLiga.clear();
      return null;
    }

    // Param vorhanden, aber leer oder nur Whitespace -> Redirect auf /home ohne Param
    if (raw == null || raw.trim().length === 0) {
      this.performInvalidRedirect();
      return null;
    }

    raw = raw.trim();
    const isNumeric = /^[0-9]+$/.test(raw);

    try {
      const resp: BogenligaResponse<LigaDO> = isNumeric
        ? await this.ligaProvider.findById(raw)
        : await this.ligaProvider.findBySlug(raw);

      const liga = resp.payload;

      if (!liga || liga.id == null) {
        // Kein echter Fehler geworfen -> synthetische Not-Found-Notification erzeugen und redirecten
        this.errorHandlingService.handleHttpError({
          status: 404,
          error: {
            errorCode: 'LIGA_NOT_FOUND_ERROR',
            errorMessage: `No result found for liga: '${raw}'`,
            param: null
          }
        });
        this.performInvalidRedirect();
        return null;
      }

      // Kanonischen Slug bestimmen
      const canonicalSlug = slugifyLigaName(liga.name ?? `liga-${liga.id}`);

      // Wenn Param numerisch war, akzeptieren wir ihn so (keine Umschreibung).
      // Wenn Param slug war und nicht dem kanonischen Slug entspricht -> Umschreiben
      if (!isNumeric && raw !== canonicalSlug) {
        // Umschreiben der URL auf kanonischen Param (ersetzt den aktuellen Eintrag)
        this.router.navigate(['/home'], {
          queryParams: { liga: canonicalSlug },
          replaceUrl: true
        });
      }

      // RememberedLiga setzen
      const remembered: RememberedLiga = {
        id: liga.id,
        name: liga.name ?? `Liga ${liga.id}`,
        slug: canonicalSlug
      };
      this.rememberedLiga.set(remembered);

      return liga;
    } catch (e) {
      console.warn('LigaResolver: Fehler beim Laden der Liga', e);
      // Fehler an den ErrorHandlingService übergeben
      this.errorHandlingService.handleHttpError(e);
      // Ungültig / Fehler -> Redirect ohne Param
      this.performInvalidRedirect();
      return null;
    }
  }

  private performInvalidRedirect(): void {
    this.rememberedLiga.clear();
    // Entfernt den liga-Query-Param vollständig
    this.router.navigate(['/home'], { replaceUrl: true });
  }
}
