import { Match } from './../../types/match';
import { FullscreenService } from './../../../../services/fullscreen.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'bla-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.scss']
})
export class InterfaceComponent implements OnInit, OnDestroy {

  selectedPlayNumber = 1;

  match: Match;

  spotting = true;

  selectedValue = -1;

  constructor(private fullscreenService: FullscreenService) { }

  ngOnInit() {
    this.fullscreenService.emitChange(true);

    if (localStorage.getItem('match')) {
      this.match = JSON.parse(localStorage.getItem('match'));
    } else {
      this.match = new Match('Nürtingen', 1);
    }
  }

  ngOnDestroy(): void {
    this.fullscreenService.emitChange(false);
  }

  onSave() {
    if (this.selectedValue >= 0 && this.selectedValue <= 10) {
      this.match.currentSet.currentPlay.number = this.selectedValue;

      // send current play() then {
      if (!this.match.addPlay()) {
        this.match.addSet();
      }

      this.selectedValue = -1;

      // }

    }
  }

  onNextSet() {
    if (!this.match.addSet()) {
      // Send set to Server to confirm

      // Create new Set
    }
  }

  onFinishMatch() {
    if (this.match.canFinish()) {
      // Send match to Server to confirm
      // -> when successful:
      localStorage.removeItem('match');
      this.match = new Match('Frickenhausen', 0);
      // Send information to server that match is finished
    }
  }

  onBack() {
    if (this.match.lastSet() && this.match.currentSet.currentPlayNumber === 1) {
      this.spotting = false;
    }

  }

  selectResult(selected: any) {
    this.selectedValue = selected;
  }

  changeFinal() {
    this.match.currentSet.currentPlay.final = !this.match.currentSet.currentPlay.final;
  }


}
