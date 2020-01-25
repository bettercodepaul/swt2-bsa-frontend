import { MatchJsonToClass } from './../../mapper/match-json-to-class.mapper';
import { Router } from '@angular/router';
import { Match } from './../../types/match';
import { Component, OnInit } from '@angular/core';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'bla-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.scss']
})
export class InterfaceComponent implements OnInit {

  faArrowCircleLeft = faArrowCircleLeft;

  selectedPlayNumber = 1;

  match: Match;

  spotting = true;

  selectedValue = -1;

  unsure = false;

  editing = false;
  editedPlay = -1;

  constructor(private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem('match')) {
      const temp = JSON.parse(localStorage.getItem('match'));
      this.match = MatchJsonToClass.parseMatch(temp);
      this.selectedPlayNumber = this.match.set().currentPlayNumber;
      if (this.match.set().play().result) {
        this.spotting = false;
      }
    } else {
      this.match = new Match('Nürtingen', 1);
    }
  }

  /**
   * Saves current selected value to result of current play of current set if not editing
   * Changes result of selected play of current set if editing
   */
  onSave() {
    if (!this.editing) {
      if (this.selectedValue >= 0 && this.selectedValue <= 10) {
        this.match.set().play().result = this.selectedValue;
        this.match.set().play().final = !this.unsure;
        this.unsure = false;

        // TODO: send current play() over Service then {
        if (!this.match.nextPlay()) {
          this.spotting = false;
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
        if (!this.spotting) {
          this.spotting = false;
        } else {
          this.match.set().play(this.editedPlay).final = !this.unsure;
          this.unsure = false;
          this.onEdit(this.selectedPlayNumber + 1);
        }
        // TODO: send current play() over Service then {
        this.editing = false;
      }
    }
    localStorage.setItem('match', JSON.stringify(this.match));
  }

  // sets the attributes to display the result of the play to change
  onEdit(play: number) {
    this.selectedPlayNumber = play;
    this.editing = true;
    this.selectedValue = this.match.set().play(play).result;
    this.editedPlay = play;
  }

  // If everything is final, create new set and send confirmation to backend, that set is finished
  onNextSet() {
    if (this.match.addSet()) {
      this.spotting = true;
      this.editing = false;
      this.selectedPlayNumber = 1;
      this.selectedValue = -1;
      this.editedPlay = -1;
      this.unsure = false;

      // TODO: Send set to Server to confirm

      localStorage.setItem('match', JSON.stringify(this.match));
    }
  }

  /**
   * If the match can end (the current set is final) a confirmation will be sent to the Server
   * The server will respond with the new information for the next match (Mannschaft)
   */
  onFinishMatch() {
    if (this.match.canFinish()) {
      // Send match to Server to confirm
      // -> when successful: get new Match Information back from the Server
      localStorage.removeItem('match');
      this.match = new Match('Frickenhausen', this.match.bahn);
    }
  }

  /**
   * Allows the spotter to directly go back to the previous play
   */
  onBack() {
    if (this.match.set().currentPlayNumber > 1) {
      this.onEdit(this.match.set().currentPlayNumber - 1);
    }

  }

  /**
   * sets the selected result from the user interface
   * @param selected selected result
   */
  selectResult(selected: any) {
    this.selectedValue = selected;
    if (this.selectedValue >= 0 && this.selectedValue <= 10) {
      this.match.set().play(this.selectedPlayNumber).result = this.selectedValue;
    }
  }

  /**
   * Redirects the spotter to the home page while maintaining the current match if not finished
   */
  onExit() {
    localStorage.setItem('match', JSON.stringify(this.match));
    this.router.navigateByUrl('/home');
  }


}
