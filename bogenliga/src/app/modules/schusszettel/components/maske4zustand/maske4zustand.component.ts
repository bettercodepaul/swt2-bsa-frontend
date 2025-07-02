import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, OnChanges, SimpleChanges} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {TabletSchusszettel} from '../../models/tablet-schusszettel.model';
import {MatchProviderService} from '../../../wkdurchfuehrung/services/match-provider.service';
import { AppComponent } from 'src/app/app.component';
import {RequestResult} from '../../../shared/data-provider';

@Component({
  selector: 'bla-maske4zustand',
  templateUrl: './maske4zustand.component.html',
  styleUrls: ['./maske4zustand.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Maske4ZustandComponent implements OnInit, OnDestroy, OnChanges {
  /** full tablet state; wait for it via *ngIf */
  @Input() infos: TabletSchusszettel | null = null;

  /** fires when “Weiter” is clicked */
  @Output() weiter = new EventEmitter<void>();

  match1Id: number | null = null;
  match2Id: number | null = null;
  matchIdsLoading = false;

  constructor(
    private app: AppComponent,
    private matchProviderService: MatchProviderService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.app.fullscreen = true; //  Navbar und Footer ausblenden
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['infos'] && this.infos) {
      this.loadMatchIds();
    }
  }

  private async loadMatchIds(): Promise<void> {
    if (!this.infos?.wettkampfInfo?.wettkampfId || !this.infos?.eigenesTeam?.teamId) {
      console.log('Missing required data for match loading:', {
        wettkampfId: this.infos?.wettkampfInfo?.wettkampfId,
        teamId: this.infos?.eigenesTeam?.teamId
      });
      this.matchIdsLoading = false;
      return;
    }

    console.log('Loading match IDs for:', {
      wettkampfId: this.infos.wettkampfInfo.wettkampfId,
      teamId: this.infos.eigenesTeam.teamId
    });

    this.matchIdsLoading = true;

    try {
      // Get all matches for this wettkampf
      const response = await this.matchProviderService.findAllWettkampfMatchesAndNamesById(this.infos.wettkampfInfo.wettkampfId);
      console.log('Match response:', response);

      if (response.result === RequestResult.SUCCESS && response.payload) {
        console.log('Found matches:', response.payload);
        
        // Find our team's match
        const ourMatch = response.payload.find((match) =>
          match.mannschaftId === this.infos?.eigenesTeam.teamId
        );
        console.log('Our match:', ourMatch);

        if (ourMatch) {
          // Get the match pair
          const pairResponse = await this.matchProviderService.pair(ourMatch.id);
          console.log('Pair response:', pairResponse);

          if (pairResponse.result === RequestResult.SUCCESS && pairResponse.payload) {
            this.match1Id = pairResponse.payload[0];
            this.match2Id = pairResponse.payload[1];
            console.log('Match IDs loaded:', { match1Id: this.match1Id, match2Id: this.match2Id });
          } else {
            console.error('Failed to get match pair:', pairResponse);
          }
        } else {
          console.error('Could not find match for team:', this.infos.eigenesTeam.teamId);
        }
      } else {
        console.error('Failed to load matches:', response);
      }
    } catch (error) {
      console.error('Error loading match IDs:', error);
    } finally {
      this.matchIdsLoading = false;
      this.cdr.detectChanges();
      console.log('Match loading completed. Final state:', {
        match1Id: this.match1Id,
        match2Id: this.match2Id,
        loading: this.matchIdsLoading
      });
    }
  }
  ngOnDestroy(): void {
    this.app.fullscreen = false; //  Beim Verlassen wieder anzeigen
  }

  onWeiter(): void {
    this.weiter.emit();
  }

  /** 1-based index of next passe */
  get currentPasse(): number {
    return (this.infos?.satzErgebnisse.length ?? 0) + 1;
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

  /** get safe URL for embedded schusszettel */
  getSchusszettelUrl(): SafeResourceUrl {
    const url = `/wkdurchfuehrung/schusszettel/${this.match1Id}/${this.match2Id}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
