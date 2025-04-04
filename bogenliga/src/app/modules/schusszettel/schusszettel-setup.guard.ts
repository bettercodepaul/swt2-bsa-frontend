import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MatchStateService } from './match-state.service';

/**
 * Route guard for protecting Schusszettel mask routes.
 * Ensures the tablet was initialized properly via "Setup Tablet Schusszettel",
 * usually triggered through a QR code scan or admin permission. If not initialized,
 * the user is redirected to the registration mask to enter archers again.
 */
@Injectable({ providedIn: 'root' })
export class SchusszettelSetupGuard implements CanActivate {
  constructor(private matchState: MatchStateService, private router: Router) {}

  canActivate(): boolean {
    if (this.matchState.rueckennummern.length === 3 && this.matchState.matchId !== null) {
      return true;
    }
    this.router.navigate(['/schusszettel/registrierung']);
    return false;
  }
}
