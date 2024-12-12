import { SpotterResult } from './../../types/spotter-result.enum';
import { SpotterService } from './../../services/spotter.service';
import { MatchJsonToClass } from './../../mapper/match-json-to-class.mapper';
import { Router } from '@angular/router';
import { Match } from './../../types/match';
import { Component, OnInit } from '@angular/core';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import {MatchDOExt} from "@wkdurchfuehrung/types/match-do-ext.class";
import {BogenligaResponse} from "@shared/data-provider";

@Component({
  selector: 'bla-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.scss']
})
export class InterfaceComponent implements OnInit {

  faArrowCircleLeft = faArrowCircleLeft;

  selectedPlayNumber = 1;

  match: Match;
  matchTemp: Match;
  matchDOs: MatchDOExt[];
  spotterMatches: MatchDOExt[];
  wkID: string;
  scheibe = 0;

  currentMatchNumberTemp = 0;

  spotting = true;

  selectedValue = -1;

  unsure = false;

  editing = false;
  editedPlay = -1;
  allowedToSaveSet = false;

  constructor(private router: Router, private spotterService: SpotterService) {
    this.spotterMatches = [];
    this.matchDOs = [];
  }

  ngOnInit() {
    if (localStorage.getItem('match') !== null) {
      const temp = JSON.parse(localStorage.getItem('match'));
      console.log(temp.toString());
      this.match = MatchJsonToClass.parseMatch(temp);
      this.currentMatchNumberTemp = this.match.currentMatchNumber;
      console.log(this.match);
      this.checkResultIsSure();

      this.selectedPlayNumber = this.match.set().currentPlayNumber;
      if (this.match.set().play().result) {
        this.spotting = true;
      }
    } else {
      this.match = new Match('Nürtingen', 1);
      this.match.currentMatchNumber = 0;
    }
    console.log(this.match);
    const urlParts = this.spotterService.getWettkampfIDundScheibe();
    try {
      this.wkID = urlParts.wkId;
      this.scheibe = parseInt(urlParts.schreibe);
    } catch (error) {
      console.error("Fehler beim parsen von WettkampfId und Scheibe Nummer", error);
    }
    this.initMatches();
  }
  private async initMatches() {
    console.log(this.wkID);
    try {
        const data: unknown = await this.spotterService.findMatch(this.wkID);
        // @ts-ignore
        this.matchDOs = data.payload;
      } catch (error) {
      console.error("Fehler beim Abrufen der Matches:", error); }

    for (const element of this.matchDOs) {
      if (element.matchScheibennummer === this.scheibe) {
        this.spotterMatches.push(element);
      }
    }
    this.setMannschaftsName(this.spotterMatches[this.match.currentMatchNumber].mannschaftName);
    this.setBahn(this.scheibe);
  }

  setMannschaftsName(name: string) {
    this.match.mannschaft = name;
  }
  setBahn(scheibe: number) {
    this.match.bahn = scheibe;
  }
  /**
   * Saves current selected value to result of current play of current set if not editing
   * Changes result of selected play of current set if editing
   */
  checkResultIsSure(): boolean {
    const temp = JSON.parse(localStorage.getItem('match'));
    this.matchTemp = MatchJsonToClass.parseMatch(temp);

    this.allowedToSaveSet = false;
    if (this.checkAllPointsScored()) {
      for (let i = 1; i < 7; i++) {
        if (!this.matchTemp.set().play(i).final) {
          this.allowedToSaveSet = true;
        }
      }
    }
    return this.allowedToSaveSet;
  }
  checkAllPointsScored(): boolean {
    let pointsAreScored = true;
    for ( let i = 0; i < 6 && pointsAreScored; i++) {
      if ( this.matchTemp.set().plays[i].result === undefined) {
        pointsAreScored = false;
      }
    }
    return pointsAreScored;
  }

  onSave() {



    if (!this.editing) {
      if (this.selectedValue >= 0 && this.selectedValue <= 10) {
        this.match.set().play().result = this.selectedValue;
        this.match.set().play().final = !this.unsure;
        this.spotterService.sendPlay(this.match.set().play()).then(() => {
          this.unsure = false;
          if (!this.match.nextPlay()) {
            this.spotting = false;
          } else {
            this.selectedPlayNumber++;
          }
          this.selectedValue = -1;
        }, (error: SpotterResult) => {
          if (error === SpotterResult.UNAUTHORIZED) {
            // TODO: Better error handling
            alert('You are not authorized to do that');
          } else {
            // TODO: Better error handling
            alert('There was an error with this request');
          }
        });
      }

    } else {
      if (this.selectedValue >= 0 && this.selectedValue <= 10) {
        this.match.set().play(this.editedPlay).result = this.selectedValue;
        this.match.set().play(this.editedPlay).final = true;
        if (this.spotting) {
          this.match.set().play(this.editedPlay).final = !this.unsure;
        }
        this.spotterService.sendPlay(this.match.set().play(this.editedPlay)).then(() => {
          if (!this.spotting) {
            this.spotting = false;
          } else {
            this.onEdit(this.match.set().currentPlayNumber);
          }
          if (!this.checkResultIsSure()) {
            this.unsure = false;
            this.editing = false;
          }

        }, (error: SpotterResult) => {
          if (error === SpotterResult.UNAUTHORIZED) {
            // TODO: Better error handling
            alert('You are not authorized to do that');
          } else {
            // TODO: Better error handling
            alert('There was an error with this request');
          }
        });
      }
    }
    this.match.currentMatchNumber = this.currentMatchNumberTemp;
    localStorage.setItem('match', JSON.stringify(this.match));
    console.log(this.match);

    this.checkResultIsSure();
    // tslint:disable-next-line:triple-equals

  }

  /**
   * sets the attributes to display the result of the play to change
   */
  onEdit(play: number) {
    this.selectedPlayNumber = play;
    this.editing = true;
    this.selectedValue = this.match.set().play(play).result;
    this.editedPlay = play;
  }

  /**
   * If everything is final, create new set and send confirmation to backend, that set is finished
   */
  onNextSet() {
    console.log(this.match);
    console.log("currentSetNumber: "+ this.match.currentSetNumber);

    if (this.match.addSet()) {
     this.spotterService.nextSet(this.spotterMatches[this.match.currentMatchNumber], this.matchTemp).then(() => {
        this.spotting = true;
        this.editing = false;
        this.selectedPlayNumber = 1;
        this.selectedValue = -1;
        this.editedPlay = -1;
        this.unsure = false;
      }, (error: SpotterResult) => {
        if (error === SpotterResult.UNAUTHORIZED) {
          // TODO: Better error handling
          alert('You are not authorized to do that');
        } else {
          // TODO: Better error handling
          alert('There was an error with this request');
        }
      });
      localStorage.setItem('match', JSON.stringify(this.match));
    }
  }

  /**
   * If the match can end (the current set is final) a confirmation will be sent to the Server
   * The server will respond with the new information for the next match (Mannschaft)
   */
  onFinishMatch() {

    console.log(this.match);

    console.log(this.match.currentMatchNumber);
    this.setMannschaftsName(this.spotterMatches[this.match.currentMatchNumber].mannschaftName);
    this.setBahn(this.scheibe);
    if (this.match.canFinish()) {

      this.spotterService.nextSet(this.spotterMatches[this.match.currentMatchNumber], this.matchTemp).then((mannschaft: string) => {
        localStorage.removeItem('match');
        this.match = new Match(this.spotterMatches[this.match.currentMatchNumber].mannschaftName, this.scheibe);
        this.spotting = true;
        this.editing = false;
        this.selectedPlayNumber = 1;
        this.selectedValue = -1;
        this.editedPlay = -1;
        this.unsure = false;
      }, (error: SpotterResult) => {
        if (error === SpotterResult.UNAUTHORIZED) {
          // TODO: Better error handling
          alert('You are not authorized to do that');
        } else {
          // TODO: Better error handling
          alert('There was an error with this request');
        }
      });
    }
    this.match.currentMatchNumber += 1;
    this.currentMatchNumberTemp = this.match.currentMatchNumber;
    console.log(this.spotterMatches[this.match.currentMatchNumber]);
    localStorage.setItem('match', JSON.stringify(this.match));

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
