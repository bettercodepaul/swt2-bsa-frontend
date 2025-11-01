import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

/**
 * Komponente für die Ligaübersicht.
 *
 * Diese Komponente zeigt eine zentrale Übersicht aller Ligen.
 * Aktuell wird ein Platzhalter (leerer Baum) angezeigt, bis die Datenintegration erfolgt.
 */
@Component({
  selector: 'bla-liga-overview',
  templateUrl: './liga-overview.component.html',
  styleUrls: ['./liga-overview.component.scss']
})
export class LigaOverviewComponent implements OnInit {

  /**
   * Konstruktor
   * @param router Angular Router für Navigation
   */
  constructor(private router: Router) {
  }

  /**
   * Lifecycle Hook: Initialisierung der Komponente
   *
   * Feuert Analytics Event für Seitenaufruf
   */
  ngOnInit(): void {
    // Analytics-Event für Seitenaufruf
    this.trackPageView();
  }

  /**
   * Tracked den Seitenaufruf für Analytics (Matomo/Piwik)
   *
   * Event-Name: page_ligauebersicht_view
   */
  private trackPageView(): void {
    if (typeof window !== 'undefined' && (window as any)._paq) {
      (window as any)._paq.push(['trackEvent', 'Navigation', 'page_ligauebersicht_view']);
    }
  }
}
