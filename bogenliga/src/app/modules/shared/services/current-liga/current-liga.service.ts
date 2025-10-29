import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LigaDO } from '@verwaltung/types/liga-do.class';
import { LigaDataProviderService } from '@verwaltung/services/liga-data-provider.service';

const STORAGE_KEY = 'bsa.currentLigaId';

@Injectable({
  providedIn: 'root'
})
export class CurrentLigaService {
  private currentLigaSubject = new BehaviorSubject<LigaDO | null>(null);
  public currentLiga$: Observable<LigaDO | null> = this.currentLigaSubject.asObservable();

  constructor(private ligaProvider: LigaDataProviderService) {
    this.restoreFromStorage();
  }

  getCurrentLiga(): LigaDO | null {
    return this.currentLigaSubject.value;
  }

  setLiga(liga: LigaDO | null): void {
    this.currentLigaSubject.next(liga);
    if (liga && liga.id != null) {
      localStorage.setItem(STORAGE_KEY, String(liga.id));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  async setLigaById(id: number): Promise<LigaDO> {
    const resp = await this.ligaProvider.findById(id);
    const liga = resp.payload;
    this.setLiga(liga);
    return liga;
  }

  clear(): void {
    this.setLiga(null);
  }

  private async restoreFromStorage(): Promise<void> {
    const id = localStorage.getItem(STORAGE_KEY);
    if (!id) { return; }
    try {
      await this.setLigaById(Number(id));
    } catch (e) {
      this.clear();
    }
  }
}
