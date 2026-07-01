import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WkdurchfuehrungContextService {
  private veranstaltungId: number;
  private wettkampfId: number;
  private wettkampftag: number;

  setContext(veranstaltungId: number, wettkampfId: number, wettkampftag = 1): void {
    this.veranstaltungId = veranstaltungId;
    this.wettkampfId = wettkampfId;
    this.wettkampftag = wettkampftag;
  }

  getVeranstaltungId(): number {
    return this.veranstaltungId;
  }

  getWettkampfId(): number {
    return this.wettkampfId;
  }

  getWettkampftag(): number {
    return this.wettkampftag;
  }

  clear(): void {
    this.veranstaltungId = null;
    this.wettkampfId = null;
    this.wettkampftag = null;
  }
}
