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
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import { AnalyticsService } from '@shared/services';
import {SelectedLigaDataprovider} from '../../modules/shared/data-provider/SelectedLigaDataprovider'



const ID_PATH_PARAM = 'id';
export var ligaID: number;

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

  public hasLigaID: boolean;
  public ligaID: number;
  public URLRoute: string;

  private ligaSub?: Subscription;
  currentLiga: LigaDO | null = null;

  constructor(
    private store: Store<AppState>,
    private currentUserService: CurrentUserService,
    private router: Router,
    private route: ActivatedRoute,
    private onOfflineService: OnOfflineService,
    private ligaContext: LigaContextService,
    private selectedLigaDataprovider: SelectedLigaDataprovider,
    private analytics: AnalyticsService
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

  /**
   * tells store that sidebar button was used -> Sidebar needs to change
   */
  public toggleSidebar() {
    this.store.dispatch({ type: TOGGLE_SIDEBAR });
  }

  public hasUserPermissions(userPermissions: UserPermission[]): boolean {
    return this.currentUserService.hasAnyPermisson(userPermissions);
  }

  public getRoute(route: string, detailType: string): string {
    let result: string = route;
    this.URLRoute = this.router.url;
    if (this.URLRoute.startsWith("/ligatabelle") ||this.URLRoute.startsWith("/home") ) {
      const lastSlashIndex = this.URLRoute.lastIndexOf('/');
      switch(lastSlashIndex){
        case 0:
          //forget liga ID if no liga ID is part of the URL-route
          this.ligaID = undefined;
          break;
        case result.length:
          !(this.URLRoute.substring(lastSlashIndex + 1).toString() === "ligaid") ?
            this.ligaID = parseInt(this.URLRoute.substring(lastSlashIndex + 1)) : undefined;
          break;
      }

    }

    if (detailType === 'undefined') {
      return(route);
    } else if (detailType === 'verein'){
      result = result + '/' + this.currentUserService.getVerein();
    } else {
      result = result;
    }

    // Für die Home-Seite wollen wir NICHT automatisch eine Liga-ID anhängen,
    // damit man immer zurück auf die echte Startseite kommt.
    if(this.ligaID != undefined && route.startsWith("/ligatabelle")){
      result =  result + '/'+ this.ligaID.toString();
    }

    this.selectedLigaDataprovider.setSelectedLigaID(this.ligaID);

    // Analytics-Event für Navigation tracken
    this.trackNavigationClick(route);

    return result;
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
   * Für alle hier eingegebenen Routen wird der Liga-QueryParam angehängt.
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
   * Ist ein Liga-Kontext aktiv?
   * Prüft currentLiga oder (als Fallback) den gemerkten Kontext im Service.
   */
  public hasActiveLigaContext(): boolean {
    const source = this.currentLiga ?? this.ligaContext.remembered;
    return !!source?.id;
  }

  /**
   * Tracked Navigationsklicks für Analytics (Matomo/Piwik)
   *
   * @param route Die aufgerufene Route
   */
  private trackNavigationClick(route: string): void {
    if (route === '/liga') {
      this.analytics.track('nav_ligauebersicht_click', { origin: 'sidebar', route });
    }
  }

  public getSidebarCollapseIcon(): string {
    return this.isActive ? 'angle-double-right' : 'angle-double-left';
  }

  existSubitems(subitems: SideBarNavigationSubitem[]): boolean {
    return !!subitems && subitems.length > 0;
  }

  isSelected(itemroute: string): boolean {
    const currentPath = this.getCurrentPath();
    return currentPath === itemroute || currentPath.startsWith(`${itemroute}/`);
  }

  private getCurrentPath(): string {
    const url = this.router.url || '';
    return url.split('?')[0].split('#')[0];
  }
}
