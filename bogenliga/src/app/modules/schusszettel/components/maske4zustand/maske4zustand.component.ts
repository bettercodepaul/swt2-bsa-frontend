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

  /** accumulated match points for a given team */
  getMatchpunkte(teamId: number): number {
    return (
      this.infos?.matchErgebnis.find((m) => m.teamId === teamId)?.matchpunkte ?? 0
    );
  }

  /** get shooter name by ID */
  getShooterName(schuetzenId: number): string {
    const shooter = this.infos?.schuetzeStammDaten?.find((s) => s.schuetzenId === schuetzenId);
    return shooter ? `${shooter.vorname} ${shooter.nachname}` : `Schütze ${schuetzenId}`;
  }

  /** get shooter's rückennummer */
  getShooterRueckennummer(schuetzenId: number): number {
    const shooter = this.infos?.schuetzeStammDaten?.find((s) => s.schuetzenId === schuetzenId);
    return shooter?.rueckennummer || 0;
  }

  /** get current satz number by finding the latest passe with actual data */
  getCurrentSatzNr(): number {
    if (!this.infos?.satzErgebnisse || this.infos.satzErgebnisse.length === 0) {
      return 1;
    }

    // Find the highest satzNr that has actual data (non-zero points)
    let highestSatzWithData = 0;

    for (const satz of this.infos.satzErgebnisse) {
      // Check if this Satz has any actual points (not just empty/zero)
      if (satz.team1Punkte > 0 || satz.team2Punkte > 0) {
        highestSatzWithData = Math.max(highestSatzWithData, satz.satzNr);
      }
    }

    // If we found Sätze with data, the current one is the next
    // If no Sätze have data yet, we're still on Satz 1
    return highestSatzWithData > 0 ? highestSatzWithData + 1 : 1;
  }
}
