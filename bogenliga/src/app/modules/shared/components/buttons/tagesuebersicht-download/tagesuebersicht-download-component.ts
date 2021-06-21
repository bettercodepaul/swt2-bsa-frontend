import {Component, ElementRef, OnInit, ViewChild, Input} from '@angular/core';
import {environment} from '@environment';
import {UriBuilder} from '../../../data-provider';

@Component({
  selector: 'bla-tagesuebersicht-download',
  templateUrl: './tagesuebersicht-download-component.html'
})
export class TagesuebersichtDownloadComponent implements OnInit {

  // Get the value of the attribute from the html tag

  @Input()
  currentVeranstaltung : number;
  @Input()
  wettkampftag : number;

  @ViewChild('downloadLink')
  private aElementRef: ElementRef;

  constructor() {}

  ngOnInit() {}

  public getDownloadUrl(path: string): string {
    return new UriBuilder()
      .fromPath(environment.backendBaseUrl)
      .path('v1/download')
      .path(path)
      .path('?veranstaltungsid=' + this.currentVeranstaltung + '&wettkampftag=' + this.wettkampftag)
      .build();
  }
}
