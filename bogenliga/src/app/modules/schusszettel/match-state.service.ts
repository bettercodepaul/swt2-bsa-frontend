import { Injectable } from '@angular/core';

/**
 * This service holds the shared, temporary state during a Schusszettel session.
 * It is intended to be initialized once during the "Setup Tablet Schusszettel" step
 * after scanning a QR code or other initialization method. All masks use this state
 * to track the current match, participating archers, and pass progression.
 *
 * The values here are not persisted; they only exist during a single tablet session.
 */
@Injectable({ providedIn: 'root' })
export class MatchStateService {
  rueckennummern: string[] = [];     // Archer back numbers registered at setup
  matchId: number | null = null;     // Match ID assigned from backend (via QR setup)
  passNr: number = 1;                // Current pass index (incremented per cycle)
  isTeamA: boolean = true;           // Whether this tablet is team A or B
  arrowsPerShooter: number = 2;
  /*
    Configurable number of arrows per shooter in case there ever is a Team that needs to expand
    to include other type of matches instead of standard 2x3 ones (Scaleability and Modularity)
  */

  reset() {
    this.rueckennummern = [];
    this.matchId = null;
    this.passNr = 1;
    this.isTeamA = true;
  }
}
