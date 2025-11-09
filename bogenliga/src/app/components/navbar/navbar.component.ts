import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ButtonType } from '@shared/components';
import { TOGGLE_SIDEBAR, UserState } from '@shared/redux-store';
import { AppState, SidebarState } from '../../modules/shared/redux-store';
import { CurrentUserService, OnOfflineService } from '@shared/services';
import { CurrentLigaService } from '@shared/services/current-liga/current-liga.service';

@Component({
  selector: 'bla-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  public ButtonType = ButtonType;
  public isActive: boolean;
  public isLoggedIn: boolean;
  public isDefaultUserLoggedIn: boolean;
  public isUserDropdownVisible = false;

  public ligaName = '';
  public hasID = false;

  private ligaSub?: Subscription;
  private storeSubs: Subscription[] = [];

  constructor(
    private translate: TranslateService,
    private store: Store<AppState>,
    private userService: CurrentUserService,
    private onOfflineService: OnOfflineService,
    private currentLigaService: CurrentLigaService
  ) {}

  ngOnInit(): void {
    // Sidebar / User State
    this.storeSubs.push(
      this.store.pipe(select(s => s.sidebarState)).subscribe((state: SidebarState) => this.isActive = state.toggleSidebar),
      this.store.pipe(select(s => s.userState)).subscribe((state: UserState) => this.isLoggedIn = state.isLoggedIn),
      this.store.pipe(select(s => s.userState)).subscribe((state: UserState) => this.isDefaultUserLoggedIn = state.isDefaultUserLoggedIn)
    );

    // Initialer Liga-Status
    const liga = this.currentLigaService.getCurrentLiga(); // Aktuelle Liga wird über den currentLigaService bezogen, anstatt über HTTP-Anfragen
    if (liga?.id != null) {
      this.ligaName = liga.name;
      this.hasID = true;
    } else {
      this.ligaName = '';
      this.hasID = false;
    }

    // Reaktiv bei Änderungen
    this.ligaSub = this.currentLigaService.state$.subscribe(state => {
      const l = state.liga;
      if (l?.id != null) {
        this.ligaName = l.name;
        this.hasID = true;
      } else {
        this.ligaName = '';
        this.hasID = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.ligaSub?.unsubscribe();
    this.storeSubs.forEach(s => s.unsubscribe());
  }

  public useLanguage(language: string) {
    this.translate.use(language);
  }

  public toggleNavbar() {
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

  public onHomeLogoClick(): void {
    // Liga-Kontext löschen
    this.currentLigaService.clear();
    // Lokale Anzeige zurücksetzen
    this.hasID = false;
    this.ligaName = '';
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
}
