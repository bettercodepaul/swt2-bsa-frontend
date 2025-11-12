import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { LigaDataProviderService } from '@verwaltung/services/liga-data-provider.service';
import { LigaDO } from '@verwaltung/types/liga-do.class';
import { BogenligaResponse } from '@shared/data-provider';

@Injectable({ providedIn: 'root' })
export class LigaResolver implements Resolve<LigaDO | null> {
  constructor(private ligaProvider: LigaDataProviderService) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<LigaDO | null> {
    const raw = route.queryParamMap.get('liga');
    if (!raw) return null;

    const isNumeric = /^[0-9]+$/.test(raw);
    try {
      let resp: BogenligaResponse<LigaDO>;
      if (isNumeric) {
        resp = await this.ligaProvider.findById(raw);
      } else {
        resp = await this.ligaProvider.findBySlug(raw);
      }
      return resp.payload?.id != null ? resp.payload : null;
    } catch {
      return null;
    }
  }
}
