import {Injectable} from '@angular/core';

/**
 * Einfache globale Screenreader-Announce-API.
 *
 * Nutzt ein einzelnes aria-live-Element im Root-Template (app.component.html)
 * mit dem Attribut data-a11y-live-region="global".
 */
@Injectable({ providedIn: 'root' })
export class A11yLiveAnnouncerService {

  private liveElement: HTMLElement | null = null;

  /**
   * Gibt das globale Live-Region-Element zurück (falls vorhanden).
   */
  private getLiveElement(): HTMLElement | null {
    if (this.liveElement) {
      return this.liveElement;
    }

    this.liveElement = document.querySelector<HTMLElement>('[data-a11y-live-region="global"]');
    return this.liveElement;
  }

  /**
   * Gibt eine kurze Nachricht für Screenreader aus.
   *
   * Erwartet bereits lokalisierten Text.
   */
  public announce(message: string): void {
    if (!message) {
      return;
    }

    const el = this.getLiveElement();
    if (!el) {
      return;
    }

    // Inhalt kurz leeren, dann neu setzen, damit Screenreader erneut ansagen.
    el.textContent = '';
    setTimeout(() => {
      el.textContent = message;
    }, 10);
  }
}
