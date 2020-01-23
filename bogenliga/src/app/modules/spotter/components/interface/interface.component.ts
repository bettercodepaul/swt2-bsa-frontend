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

  unsure = false;

  editing = false;
  editedPlay = -1;

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
    if (!this.editing) {
      if (this.selectedValue >= 0 && this.selectedValue <= 10) {
        this.match.set().play().result = this.selectedValue;
        this.match.set().play().final = !this.unsure;
        this.unsure = false;

        // send current play() then {
        if (!this.match.nextPlay()) {
          this.spotting = false;
          //this.match.addSet();
        } else {
          this.selectedPlayNumber++;
        }

        this.selectedValue = -1;

        // }

      }
    } else {
      if (this.selectedValue >= 0 && this.selectedValue <= 10) {
        this.match.set().play(this.editedPlay).result = this.selectedValue;
        this.match.set().play(this.editedPlay).final = true;

        this.spotting = false;
        this.editing = false;
      }
    }
  }

  onEdit(play: number) {
    this.selectedPlayNumber = play;
    this.editing = true;
    this.selectedValue = this.match.set().play(play).result;
    this.editedPlay = play;
  }

  onNextSet() {
    if (this.match.addSet()) {
      this.spotting = true;
      this.editing = false;
      this.selectedPlayNumber = 1;
      this.selectedValue = -1;
      this.editedPlay = -1;
      this.unsure = false;
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
    if (this.match.lastSet() && this.match.set().currentPlayNumber === 1) {
      this.spotting = false;
    }

  }

  selectResult(selected: any) {
    this.selectedValue = selected;
    if (this.selectedValue >= 0 && this.selectedValue <= 10) {
      this.match.set().play(this.selectedPlayNumber).result = this.selectedValue;
    }
  }

  changeFinal() {
    this.match.set().play().final = !this.match.set().play().final;
  }


}
