import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SchusszettelService} from '../../services/schusszettel.service';
import {TabletSchusszettel} from '../../models/tablet-schusszettel.model';
import {SchuetzenSatzDTO} from '../../types/datatransfer/satz-eingabe-dto';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'bla-tablet',
  templateUrl: './tablet.component.html',
  styleUrls: ['./tablet.component.scss']
})
export class TabletComponent implements OnInit, OnDestroy {
  token!: string;
  teamId!: number;
  wettkampfId!: number;
  data?: TabletSchusszettel;

  loading = false;
  errorMsg: string | null = null;
  showZustandFirst = true;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private schussService: SchusszettelService
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap
        .pipe(takeUntil(this.destroy$))
        .subscribe((params) => {
          this.token       = params.get('token')!;
          this.teamId      = Number(params.get('teamid'));
          this.wettkampfId = Number(params.get('wettkampfid'));
          this.load();
        });
  }

  load(): void {
    // validate params
    if (!this.token || isNaN(this.teamId) || isNaN(this.wettkampfId)) {
      this.errorMsg = 'Ungültige URL-Parameter.';
      return;
    }

    this.loading  = true;
    this.errorMsg = null;

    this.schussService
        .getSchusszettel(this.token, this.wettkampfId, this.teamId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (resp) => {
            this.data    = resp;
            this.loading = false;
            this.showZustandFirst = true;
          },
          error: (err) => {
            console.error('Fehler beim Laden:', err);
            this.errorMsg = 'Daten konnten nicht geladen werden. Bitte später erneut versuchen.';
            this.loading  = false;
          }
        });
  }

  onRegister(meldungen: number[]): void {
    this.schussService
        .postSchuetzenMeldung(this.token, this.wettkampfId, this.teamId, meldungen)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: ()  => this.load(),
          error: (err) => console.error('Registrierungsfehler:', err)
        });
  }

  onSatz(satzeingabe: SchuetzenSatzDTO[]): void {
    this.schussService
        .postSatzEingabe(this.token, this.wettkampfId, this.teamId, satzeingabe)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: ()  => this.load(),
          error: (err) => console.error('Eingabefehler:', err)
        });
  }

  onZustandWeiter(): void {
    this.showZustandFirst = false;
  }

  /**
   * Handle "Weiter" button click from MATCH_ENDE state.
   * This triggers a GET request to advance to the next match or tournament end.
   */
  onMatchEndeWeiter(): void {
    this.load(); // Trigger GET request to advance state on backend
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Aborts the current passe input and returns to the initial state view.
   * This is used when the passe input cannot be performed safely,
   * for example if the shooter data is inconsistent.
   */
  onPasseAbort(): void {
    this.showZustandFirst = true;
  }
}
