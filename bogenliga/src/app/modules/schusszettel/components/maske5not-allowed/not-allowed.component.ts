import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {TabletSchusszettel} from '../../models/tablet-schusszettel.model';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'bla-maske5not-allowed',
  templateUrl: './not-allowed.component.html',
  styleUrls: ['./not-allowed.component.scss']
})
export class NotAllowedComponent implements OnInit, OnDestroy {
  @Input() infos!: TabletSchusszettel;

  constructor(private app: AppComponent) {}
  /** reloads the page to let the user try again */
  retry(): void {
    window.location.reload();
  }
  ngOnInit(): void {
    this.app.fullscreen = true; //  Navbar und Footer ausblenden
  }
  ngOnDestroy(): void {
    this.app.fullscreen = false; //  Beim Verlassen wieder anzeigen
  }
}
