import {Component, ElementRef, OnInit, ViewChild, Input} from '@angular/core';
import {environment} from '@environment';
import {UriBuilder} from '../../../data-provider';

@Component({
  selector: 'bla-gesamtstatistik-download',
  templateUrl: './gesamtstatistik-download.component.html'
})
export class GesamtstatistikDownloadComponent implements OnInit {

  // Get the value of the attribute from the html tag
  @Input()
  currentVeranstaltung : number;
  @Input()
  currentMannschaft : number;
  @Input()
  currentJahr : number;

  @ViewChild('downloadLink')
  private aElementRef: ElementRef;

  constructor() {}

  ngOnInit() {}

  public getDownloadUrl(path: string): string {
    return new UriBuilder()
      .fromPath(environment.backendBaseUrl)
      .path('v1/download')
      .path(path)
      .path('?veranstaltungsid=' + this.currentVeranstaltung + '&manschaftsid=' + this.currentMannschaft + '&jahr=' + this.currentJahr)
      .build();
  }
}
