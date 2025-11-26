import { Injectable } from '@angular/core';

export interface RememberedLiga {
  id: number;
  name: string;
  slug: string;
}

const KEY = 'bogenliga_remembered_liga';

@Injectable({ providedIn: 'root' })
export class RememberedLigaService {

  set(liga: RememberedLiga | null): void {
    if (!liga) {
      sessionStorage.removeItem(KEY);
      return;
    }
    sessionStorage.setItem(KEY, JSON.stringify(liga));
  }

  get(): RememberedLiga | null {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as RememberedLiga;
      if (parsed && typeof parsed.id === 'number') {
        return parsed;
      }
    } catch {}
    return null;
  }

  clear(): void {
    sessionStorage.removeItem(KEY);
  }
}
