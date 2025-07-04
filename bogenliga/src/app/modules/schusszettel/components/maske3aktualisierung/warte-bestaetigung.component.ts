import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import {TabletSchusszettel} from '../../models/tablet-schusszettel.model';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'bla-maske3aktualisierung',
  templateUrl: './warte-bestaetigung.component.html',
  styleUrls: ['./warte-bestaetigung.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarteBestaetigungComponent implements OnInit, OnDestroy {
  /** full tablet state; render only when truthy */
  @Input() infos: TabletSchusszettel | null = null;

  /** emitted when the user clicks “Refresh Status” */
  @Output() refresh = new EventEmitter<void>();

  constructor(private app: AppComponent) {}

  onRefreshClick(): void {
    console.log('User requested status refresh');
    this.refresh.emit();
  }

  /** Calculate average points per passe for all shooters */
  getAverageShooterPoints(): any[] {
    if (!this.infos?.schuetzenMatchPunkte || !this.infos?.schuetzeStammDaten) {
      return [];
    }

    const currentPasse = this.getCurrentPasseNumber();
    const passesCompleted = Math.max(0, currentPasse - 1);

    return this.infos.schuetzenMatchPunkte.map((shooter) => {
      const stammdaten = this.infos?.schuetzeStammDaten?.find((s) => s.schuetzenId === shooter.schuetzenId);
      
      // Calculate average per passe (each passe has 2 arrows, max 20 points)
      const averagePerPasse = passesCompleted > 0 ? (shooter.punkteBisher / passesCompleted) : 0;
      // Calculate average per arrow
      const averagePerArrow = passesCompleted > 0 ? (shooter.punkteBisher / (passesCompleted * 2)) : 0;
      
      return {
        schuetzenId: shooter.schuetzenId,
        rueckennummer: stammdaten?.rueckennummer || 0,
        name: stammdaten ? `${stammdaten.vorname} ${stammdaten.nachname}` : `Schütze ${shooter.schuetzenId}`,
        punkteBisher: shooter.punkteBisher,
        passesCompleted: passesCompleted,
        averagePerPasse: averagePerPasse,
        averagePerArrow: averagePerArrow,
        percentage: passesCompleted > 0 ? ((averagePerArrow / 10) * 100) : 0 // Percentage of max possible (10 per arrow)
      };
    }).sort((a, b) => b.averagePerPasse - a.averagePerPasse); // Sort by best average first
  }

  /** Get current passe number */
  getCurrentPasseNumber(): number {
    return this.infos?.currentPasseNumber || this.calculateCurrentPasseNumber();
  }

  /** Fallback calculation for current passe number */
  private calculateCurrentPasseNumber(): number {
    if (!this.infos?.satzErgebnisse || this.infos.satzErgebnisse.length === 0) {
      return 1;
    }
    const completedPasses = this.infos.satzErgebnisse.length;
    return completedPasses + 1;
  }

  /** Get team statistics */
  getTeamStatistics(): any {
    const shooters = this.getAverageShooterPoints();
    if (shooters.length === 0) {
      return null;
    }

    const totalPoints = shooters.reduce((sum, s) => sum + s.punkteBisher, 0);
    const totalPossiblePoints = shooters.reduce((sum, s) => sum + (s.passesCompleted * 20), 0); // 20 max per passe
    const teamAverage = shooters.reduce((sum, s) => sum + s.averagePerPasse, 0) / shooters.length;
    const teamPercentage = totalPossiblePoints > 0 ? (totalPoints / totalPossiblePoints) * 100 : 0;

    return {
      totalPoints,
      totalPossiblePoints,
      teamAverage,
      teamPercentage,
      shooterCount: shooters.length,
      currentPasse: this.getCurrentPasseNumber()
    };
  }
  ngOnInit(): void {
    this.app.fullscreen = true; //  Navbar und Footer ausblenden
  }
  
  ngOnDestroy(): void {
    this.app.fullscreen = false; //  Beim Verlassen wieder anzeigen
  }
}
