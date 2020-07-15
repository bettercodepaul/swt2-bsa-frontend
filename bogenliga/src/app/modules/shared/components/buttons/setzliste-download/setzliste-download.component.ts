import {Component, ElementRef, OnInit, ViewChild, Input} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {UriBuilder} from '../../../data-provider';

@Component({
  selector: 'bla-setzliste-download',
  templateUrl: './setzliste-download.component.html'
})
export class SetzlisteDownloadComponent implements OnInit {

  // Get the value of the attribute from the html tag
  @Input()
  wettkampfid: number;

  @ViewChild('downloadLink', { static: false })
  private aElementRef: ElementRef;

  constructor() {}

  ngOnInit() {
  }

  public isdisabled(): boolean {
    return false;
  }

  public getDownloadUrl(path: string): string {
    return new UriBuilder()
      .fromPath(environment.backendBaseUrl)
      .path('v1/download')
      .path(path)
      .path('?wettkampfid=' + this.wettkampfid)
      .build();
  }
}
