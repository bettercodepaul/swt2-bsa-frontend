import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { select, Store } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { AppState, SidebarState, TOGGLE_SIDEBAR } from '../../modules/shared/redux-store';
import { CurrentUserService, UserPermission } from '../../modules/shared/services/current-user';
import { SIDE_BAR_CONFIG } from './sidebar.config';
import { SIDE_BAR_CONFIG_OFFLINE } from './sidebar.config';
import { OnOfflineService } from '@shared/services';
import { SideBarNavigationSubitem } from './types/sidebar-navigation-subitem.interface';
import { LigaContextService } from '@shared/services/liga-context/liga-context.service';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { LigaDO } from '@verwaltung/types/liga-do.class';
import {slugifyLigaName} from "@shared/functions/slug-utils";

@Component({
  selector: 'bla-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: [
    './sidebar.component.scss',
    './../../app.component.scss'
  ]
})
export class SidebarComponent implements OnInit, OnDestroy {

  public isActive: boolean;
  public inProd = environment.production;
  public CONFIG;
  faCaretDown = faCaretDown;

  private ligaSub?: Subscription;
  currentLiga: LigaDO | null = null;

  constructor(
    private store: Store<AppState>,
    private currentUserService: CurrentUserService,
    private router: Router,
    private route: ActivatedRoute,
    private onOfflineService: OnOfflineService,
    private ligaContext: LigaContextService,
  ) {
    store.pipe(select((state) => state.sidebarState))
      .subscribe((state: SidebarState) => this.isActive = state.toggleSidebar);
  }

  ngOnInit() {
    this.offlineSetter();

    // Liga-Kontext beobachten
    this.ligaSub = this.ligaContext.currentLiga$
      .pipe(distinctUntilChanged((a, b) => a?.id === b?.id))
      .subscribe(liga => {
        this.currentLiga = liga ?? null;
      });
  }

  ngOnDestroy(): void {
    this.ligaSub?.unsubscribe();
  }

  private offlineSetter(): void {
    if (this.onOfflineService.isOffline() === true) {
      this.CONFIG = SIDE_BAR_CONFIG_OFFLINE;
    } else {
      this.CONFIG = SIDE_BAR_CONFIG;
    }
  }

  public toggleSidebar() {
    this.store.dispatch({ type: TOGGLE_SIDEBAR });
  }

  public hasUserPermissions(userPermissions: UserPermission[]): boolean {
    return this.currentUserService.hasAnyPermisson(userPermissions);
  }

  /**
   * Liefert RouterLink-Kommandos für ein Item.
   * Hängt keinen Liga-Param an – der wird getrennt über getRouteQueryParams() geliefert.
   */
  public getRouteCommands(item: { route: string; detailType?: string }): any[] {
    let base = item.route;
    // Detailtyp Verein → Verein-ID anhängen
    if (item.detailType === 'verein') {
      base = `${base}/${this.currentUserService.getVerein()}`;
    }
    return [base];
  }

  /**
   * Liefert QueryParams inklusive liga (falls aktiv).
   * Für Routen, bei denen liga nicht sticky sein soll (z. B. reine Admin-Seiten), könnte man hier eine Ausnahme bauen.
   */
  public getRouteQueryParams(item: { route: string }): any | null {
    const source = this.currentLiga ?? this.ligaContext.remembered;
    if (source?.id != null) {
      const ligaValue = slugifyLigaName(source.name); // oder )source.id für ID
      // Whitelist für Routen:
      if (item.route.startsWith('/home') || item.route.startsWith('/ligatabelle') || item.route.startsWith('/wettkaempfe')) {
        return { liga: ligaValue };
      }
    }
    return null;
  }

  /**
   * Klick auf das Home-Icon / Home-Eintrag:
   * - Mit aktiver Liga: /home?liga=<id/slug>
   * - Ohne Liga: /home
   */
  public navigateHome(): void {
    const link = this.ligaContext.buildHomeLink(this.currentLiga ?? undefined);
    this.router.navigate(link.commands, { queryParams: link.queryParams });
    if (!this.isActive) this.toggleSidebar();
  }

  existSubitems(subitems: SideBarNavigationSubitem[]): boolean {
    return !!subitems && subitems.length > 0;
  }

  isSelected(itemroute: string): boolean {
    return (this.router.url.indexOf(itemroute) >= 0);
  }

  public getSidebarCollapseIcon(): string {
    return this.isActive ? 'angle-double-right' : 'angle-double-left';
  }
}
