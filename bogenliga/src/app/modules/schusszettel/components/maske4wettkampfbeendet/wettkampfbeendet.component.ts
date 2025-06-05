import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
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

  constructor(private app: AppComponent) {}

  /** allow user to reload or navigate away */
  reload(): void {
    window.location.reload();
  }

  ngOnInit(): void {
    this.app.fullscreen = true; //  Navbar und Footer ausblenden
  }
  ngOnDestroy(): void {
    this.app.fullscreen = false; //  Beim Verlassen wieder anzeigen
  }
}
