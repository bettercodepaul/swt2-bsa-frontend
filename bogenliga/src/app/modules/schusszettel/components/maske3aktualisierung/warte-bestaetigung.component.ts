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
  ngOnInit(): void {
    this.app.fullscreen = true; //  Navbar und Footer ausblenden
  }
  ngOnDestroy(): void {
    this.app.fullscreen = false; //  Beim Verlassen wieder anzeigen
  }
}
