import { FullscreenService } from './../../../../services/fullscreen.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'bla-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.scss']
})
export class InterfaceComponent implements OnInit, OnDestroy {

  spotting = true;

  constructor(private fullscreenService: FullscreenService) { }

  ngOnInit() {
    this.fullscreenService.emitChange(true);
  }

  ngOnDestroy(): void {
    this.fullscreenService.emitChange(false);
  }

}
