import { Injectable } from '@angular/core';
import { LocalDataProviderService } from '@shared/local-data-provider';
import { slugifyLigaName } from '@shared/functions/slug-utils';

export interface RecentLigaEntry {
  id: number;
  name: string;
  slug?: string; // neu: precomputed für schnellere Link-Erzeugung
}

const STORAGE_KEY_RECENT_LIGAS = 'recent_ligas';
const MAX_ENTRIES = 3;

@Injectable({ providedIn: 'root' })
export class RecentLigaService {

  constructor(private storage: LocalDataProviderService) {}

  public add(entry: RecentLigaEntry): void {
    let list: RecentLigaEntry[] = this.getAll();
    list = list.filter(e => e.id !== entry.id);
    // Slug sicherstellen
    const slug = entry.slug || slugifyLigaName(entry.name ?? '') || String(entry.id);
    list.unshift({ ...entry, slug });
    if (list.length > MAX_ENTRIES) {
      list = list.slice(0, MAX_ENTRIES);
    }
    this.storage.setPermanently(STORAGE_KEY_RECENT_LIGAS, JSON.stringify(list));
  }

  public getAll(): RecentLigaEntry[] {
    const value = this.storage.get(STORAGE_KEY_RECENT_LIGAS);
    try {
      const parsed = value ? JSON.parse(value) as RecentLigaEntry[] : [];
      return parsed.map(e => ({
        ...e,
        slug: e.slug || slugifyLigaName(e.name) || String(e.id)
      }));
    } catch {
      return [];
    }
  }
}
