import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { LigaDataProviderService } from '@verwaltung/services/liga-data-provider.service';
import { LigaDO } from '@verwaltung/types/liga-do.class';
import { BogenligaResponse } from '@shared/data-provider';
import { LoginDataProviderService } from '@user/services/login-data-provider.service';
import { CurrentUserService } from '@shared/services';

@Injectable({ providedIn: 'root' })
export class LigaResolver implements Resolve<LigaDO | null> {
  constructor(
    private ligaProvider: LigaDataProviderService,
    private loginProvider: LoginDataProviderService,
    private currentUser: CurrentUserService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<LigaDO | null> {
    // Login sicherstellen bevor Liga geladen wird
    if (!this.currentUser.isLoggedIn()) {
      try {
        await this.loginProvider.signInDefaultUser();
      } catch (e) {
        console.warn('Resolver Default-Login fehlgeschlagen', e);
        // wir versuchen trotzdem weiter – falls Backend anonymen Zugang erlaubt
      }
    }

    let raw = route.queryParamMap.get('liga');
    if (!raw) {
      // Falls Alias /home/liga=<...>
      raw = route.paramMap.get('liga');
    }
    if (!raw) return null;

    const isNumeric = /^[0-9]+$/.test(raw);
    try {
      let resp: BogenligaResponse<LigaDO>;
      resp = isNumeric
        ? await this.ligaProvider.findById(raw)
        : await this.ligaProvider.findBySlug(raw);

      return resp.payload?.id != null ? resp.payload : null;
    } catch {
      return null;
    }
  }
}
