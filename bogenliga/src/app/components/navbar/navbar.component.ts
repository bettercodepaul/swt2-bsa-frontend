import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { ButtonType } from '@shared/components';
import { TOGGLE_SIDEBAR } from '@shared/redux-store';
import { UserState } from '@shared/redux-store';
import { CurrentUserService, OnOfflineService } from '@shared/services';
import { AppState, SidebarState } from '../../modules/shared/redux-store';
import { Subscription } from 'rxjs';
import { LigaContextService } from '@shared/services/liga-context/liga-context.service';
import { LigaDO } from '@verwaltung/types/liga-do.class';
import { slugifyLigaName } from '@shared/functions/slug-utils';
import { RememberedLigaService } from '@shared/services/remembered-liga/remembered-liga.service';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'bla-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {

  public isActive: boolean;
  public ButtonType = ButtonType;
  public isLoggedIn: boolean;
  public isDefaultUserLoggedIn: boolean;
  public isUserDropdownVisible = false;

  // Anzeige
  public ligaName = '';
  public currentLiga: LigaDO | null = null;

  // Konfiguration: Zeige remembered Liga-Namen, wenn gerade keine active Liga in der URL ist
  private showRememberedIfNoActiveLiga = true;

  private subs: Subscription[] = [];

  constructor(
    private translate: TranslateService,
    private store: Store<AppState>,
    private userService: CurrentUserService,
    private onOfflineService: OnOfflineService,
    private ligaContext: LigaContextService,
    private rememberedLiga: RememberedLigaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Sidebar Zustand
    this.subs.push(
      store.pipe(select(s => s.sidebarState))
        .subscribe((state: SidebarState) => this.isActive = state.toggleSidebar)
    );
    // User Zustand
    this.subs.push(
      store.pipe(select(s => s.userState))
        .subscribe((state: UserState) => {
          this.isLoggedIn = state.isLoggedIn;
          this.isDefaultUserLoggedIn = state.isDefaultUserLoggedIn;
        })
    );
  }

  ngOnInit(): void {
    // Liga Kontext beobachten
    this.subs.push(
      this.ligaContext.currentLiga$.subscribe(liga => {
        this.currentLiga = liga;
        this.updateLigaName();
      })
    );

  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private updateLigaName(): void {
    if (this.currentLiga?.id != null) {
      this.ligaName = this.currentLiga.name || '';
      return;
    }
    if (this.showRememberedIfNoActiveLiga) {
      const rem = this.rememberedLiga.get();
      this.ligaName = rem?.name || '';
    } else {
      this.ligaName = '';
    }
  }

  // Getter für QueryParams des Home-Links (Logo), falls man dort aufs Liga-Home leiten wollen würde
  /*
  public get homeQueryParams(): any | null {
    if (this.currentLiga?.id != null) {
      const slug = slugifyLigaName(this.currentLiga.name || '') || String(this.currentLiga.id);
      return { liga: slug };
    }
    return null;
  }
  */

  public useLanguage(lang: string): void {
    this.translate.use(lang);
  }

  public toggleNavbar(): void {
    this.store.dispatch({ type: TOGGLE_SIDEBAR });
  }

  public toggleUserDropdown(): void {
    this.isUserDropdownVisible = !this.isUserDropdownVisible;
  }

  public isOffline(): boolean {
    return this.onOfflineService.isOffline();
  }

  public getLigaName(): string {
    return this.ligaName;
  }

  static toggleColor(): void {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      navbar.style.backgroundColor = '#b2b2b2';
      navbar.style.pointerEvents = 'none';
    }
  }
  static toggleColorAgain(): void {
    const navbar = document.getElementById('navbar');
    if (navbar) {
      navbar.style.backgroundColor = '#ffffff';
      navbar.style.pointerEvents = 'auto';
    }
  }

  /**
   * Klick auf das Bogenliga-Logo:
   * - remembered Liga löschen
   * - zu /home navigieren (ohne liga)
   */
  public onLogoClick(event: MouseEvent): void {
    event.preventDefault();
    // bevorzugt über LigaContext kapseln:
    if (this.ligaContext?.clearRemembered) {
      this.ligaContext.clearRemembered();
    }
    // Navigiere zur allgemeinen Home-Seite
    this.router.navigate(['/home']);
  }
}
