import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {TabletSchusszettel} from '../../models/tablet-schusszettel.model';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'bla-maske4wettkampbeendet',
  templateUrl: './wettkampfbeendet.component.html',
  styleUrls: ['./wettkampfbeendet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WettkampfbeendetComponent implements OnInit, OnDestroy {
  /** full tablet state; only render when set */
  @Input() infos: TabletSchusszettel | null = null;

  /** Event emitter for weiter button */
  @Output() weiter = new EventEmitter<void>();

  constructor(private app: AppComponent) {}

  /** allow user to reload or navigate away */
  reload(): void {
    window.location.reload();
  }

  /** emit weiter event to show final state */
  onWeiter(): void {
    this.weiter.emit();
  }

  ngOnInit(): void {
    this.app.fullscreen = true; //  Navbar und Footer ausblenden
  }
  ngOnDestroy(): void {
    this.app.fullscreen = false; //  Beim Verlassen wieder anzeigen
  }
}
