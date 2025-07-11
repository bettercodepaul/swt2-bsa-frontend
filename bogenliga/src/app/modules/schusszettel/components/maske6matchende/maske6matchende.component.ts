import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {TabletSchusszettel} from '../../models/tablet-schusszettel.model';
import {AppComponent} from 'src/app/app.component';

@Component({
  selector: 'bla-maske6matchende',
  templateUrl: './maske6matchende.component.html',
  styleUrls: ['./maske6matchende.component.scss']
})
export class Maske6MatchendeComponent implements OnInit, OnDestroy {
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

}
