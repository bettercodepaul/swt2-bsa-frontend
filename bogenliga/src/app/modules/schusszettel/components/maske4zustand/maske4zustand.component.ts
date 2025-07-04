import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {TabletSchusszettel} from '../../models/tablet-schusszettel.model';
import {AppComponent} from 'src/app/app.component';

@Component({
  selector: 'bla-maske4zustand',
  templateUrl: './maske4zustand.component.html',
  styleUrls: ['./maske4zustand.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Maske4ZustandComponent implements OnInit, OnDestroy {
  /** full tablet state; wait for it via *ngIf */
  @Input() infos: TabletSchusszettel | null = null;

  /** fires when "Weiter" is clicked */
  @Output() weiter = new EventEmitter<void>();


  constructor(private app: AppComponent) {}

  ngOnInit(): void {
    this.app.fullscreen = true; //  Navbar und Footer ausblenden
  }

  ngOnDestroy(): void {
    this.app.fullscreen = false; //  Beim Verlassen wieder anzeigen
  }

  onWeiter(): void {
    this.weiter.emit();
  }

  /** Check if we should show the embedded wkdurchfuehrung schusszettel component */
  shouldShowSchusszettel(): boolean {
    return !!(this.infos?.eigenesTeamMatchId && this.infos?.gegnerischesTeamMatchId);
  }


  // COMMENTED OUT: Original custom implementation - using wkdurchfuehrung schusszettel component instead
  
  /** get current satz number by finding the latest passe with actual data */
  // getCurrentSatzNr(): number {
  //   if (!this.infos?.satzErgebnisse || this.infos.satzErgebnisse.length === 0) {
  //     return 1;
  //   }

  //   // Find the highest satzNr that has actual data (non-zero points)
  //   let highestSatzWithData = 0;

  //   for (const satz of this.infos.satzErgebnisse) {
  //     // Check if this Satz has any actual points (not just empty/zero)
  //     if (satz.team1Punkte > 0 || satz.team2Punkte > 0) {
  //       highestSatzWithData = Math.max(highestSatzWithData, satz.satzNr);
  //     }
  //   }

  //   // If we found Sätze with data, the current one is the next
  //   // If no Sätze have data yet, we're still on Satz 1
  //   return highestSatzWithData > 0 ? highestSatzWithData + 1 : 1;
  // }

  /** Get team name */
  // getTeamName(isOwnTeam: boolean): string {
  //   return isOwnTeam ? this.infos?.eigenesTeam?.teamName || '' : this.infos?.gegnerischesTeam?.teamName || '';
  // }

  /** Get match number */
  // getMatchNr(): number {
  //   return 1; // Default match number, as matchId doesn't exist on TeamInfoDTO
  // }

  /** Get satz results for a team */
  // getSatzResults(isOwnTeam: boolean): number[] {
  //   const results = [0, 0, 0, 0, 0];
  //   if (this.infos?.satzErgebnisse) {
  //     this.infos.satzErgebnisse.forEach((satz) => {
  //       if (satz.satzNr >= 1 && satz.satzNr <= 5) {
  //         results[satz.satzNr - 1] = isOwnTeam ? satz.team1Punkte : satz.team2Punkte;
  //       }
  //     });
  //   }
  //   return results;
  // }

  /** Get total satzpunkte */
  // getSatzpunkte(isOwnTeam: boolean): number {
  //   const satzResults = this.getSatzResults(isOwnTeam);
  //   return satzResults.reduce((sum, points) => sum + points, 0);
  // }

  /** Get matchpunkte for display */
  // getMatchpunkte(isOwnTeam: boolean): number {
  //   const teamId = isOwnTeam ? this.infos?.eigenesTeam?.teamId : this.infos?.gegnerischesTeam?.teamId;
  //   return this.infos?.matchErgebnis?.find((m) => m.teamId === teamId)?.matchpunkte || 0;
  // }

  /** Get active shooters */
  // getActiveShooters(): any[] {
  //   if (!this.infos?.schuetzenMatchPunkte) {
  //     return [];
  //   }

  //   return this.infos.schuetzenMatchPunkte.map((shooter) => {
  //     const stammdaten = this.infos?.schuetzeStammDaten?.find((s) => s.schuetzenId === shooter.schuetzenId);
  //     return {
  //       schuetzenId: shooter.schuetzenId,
  //       rueckennummer: stammdaten?.rueckennummer || 0,
  //       name: stammdaten ? `${stammdaten.vorname} ${stammdaten.nachname}` : `Schütze ${shooter.schuetzenId}`,
  //       punkteBisher: shooter.punkteBisher,
  //       durchschnitt: shooter.punkteBisher > 0 ? (shooter.punkteBisher / (this.getCurrentSatzNr() - 1) / 6).toFixed(2) : '0.00'
  //     };
  //   });
  // }

  /** Get satz ergebnisse with additional info */
  // getSatzErgebnisse(): any[] {
  //   if (!this.infos?.satzErgebnisse) {
  //     return [];
  //   }

  //   return this.infos.satzErgebnisse
  //     .filter((s) => s.team1Punkte > 0 || s.team2Punkte > 0)
  //     .map((satz) => {
  //       let winner = '';
  //       let winnerName = '';
  //       let points = 0;

  //       if (satz.team1Punkte > satz.team2Punkte) {
  //         winner = 'team1';
  //         winnerName = this.getTeamName(true);
  //         points = 2;
  //       } else if (satz.team2Punkte > satz.team1Punkte) {
  //         winner = 'team2';
  //         winnerName = this.getTeamName(false);
  //         points = 2;
  //       } else if (satz.team1Punkte === satz.team2Punkte && satz.team1Punkte > 0) {
  //         winner = 'draw';
  //         winnerName = 'Unentschieden';
  //         points = 1;
  //       }

  //       return {
  //         ...satz,
  //         winner,
  //         winnerName,
  //         points
  //       };
  //     });
  // }
}
