import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { LigaDataProviderService } from '@verwaltung/services/liga-data-provider.service';
import { LigaDO } from '@verwaltung/types/liga-do.class';
import { BogenligaResponse } from '@shared/data-provider';
import { LoginDataProviderService } from '@user/services/login-data-provider.service';
import { CurrentUserService } from '@shared/services';
import {RememberedLiga, RememberedLigaService} from "@shared/services/remembered-liga/remembered-liga.service";
import {slugifyLigaName} from "@shared/functions/slug-utils";

@Injectable({ providedIn: 'root' })
export class LigaResolver implements Resolve<LigaDO | null> {
  constructor(
    private ligaProvider: LigaDataProviderService,
    private loginProvider: LoginDataProviderService,
    private currentUser: CurrentUserService,
    private rememberedLiga: RememberedLigaService
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

    // Kein Parameter -> Kontext leeren und null zurückgeben
    if (!raw) {
      this.rememberedLiga.clear();
      return null;
    }

    const isNumeric = /^[0-9]+$/.test(raw);

    try {
      const resp: BogenligaResponse<LigaDO> = isNumeric
        ? await this.ligaProvider.findById(raw)
        : await this.ligaProvider.findBySlug(raw);

      const liga = resp.payload;

      if (!liga || liga.id == null) {
        this.rememberedLiga.clear();
        return null;
      }

      // RememberedLiga-Objekt aufbauen
      const remembered: RememberedLiga = {
        id: liga.id,
        name: liga.name ?? `Liga ${liga.id}`,
        slug: slugifyLigaName(liga.name)
      };

      this.rememberedLiga.set(remembered);
      return liga;
    } catch (e) {
      console.warn('LigaResolver Fehler beim Laden der Liga', e);
      this.rememberedLiga.clear();
      return null;
    }
  }


}
