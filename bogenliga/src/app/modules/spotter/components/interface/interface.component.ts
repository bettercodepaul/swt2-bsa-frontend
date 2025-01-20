import { SpotterResult } from './../../types/spotter-result.enum';
import { SpotterService } from './../../services/spotter.service';
import { MatchJsonToClass } from './../../mapper/match-json-to-class.mapper';
import { Router } from '@angular/router';
import { Match } from './../../types/match';
import { Component, OnInit } from '@angular/core';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import {MatchDOExt} from "@wkdurchfuehrung/types/match-do-ext.class";
import {BogenligaResponse, RequestResult} from '@shared/data-provider';

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
  matchDOExt: MatchDOExt;

  constructor(private router: Router, private spotterService: SpotterService) {
    this.spotterMatches = [];
    this.matchDOs = [];
  }

  ngOnInit() {
    if (localStorage.getItem('match') !== null) {
      const temp = JSON.parse(localStorage.getItem('match'));
      this.match = MatchJsonToClass.parseMatch(temp);
      this.currentMatchNumberTemp = this.match.currentMatchNumber;
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

  async onSave() {
    const currentSet = this.match.set();
    const currentPlay = currentSet ? currentSet.play() : null;

    console.log("this.editedPlay", this.editedPlay);
    if (!this.editing) {
      if (this.selectedValue >= 0 && this.selectedValue <= 10) {
        try {
          if(!currentPlay.passeId) {
            if (currentPlay.number > 1) {
              if (currentPlay.number % 2 === 0) {
                if (this.match.set().play(currentPlay.number - 1).passeId) {
                  const data: unknown = await this.spotterService.nextSet(
                    this.spotterMatches[this.match.currentMatchNumber],
                    this.match,
                    this.match.set().play(currentPlay.number - 1).passeId,
                    currentPlay.number
                  );
                  console.log("%2")
                  // @ts-ignore
                  this.spotterMatches[this.match.currentMatchNumber] = data.payload;
                  currentPlay.passeId = this.match.set().play(currentPlay.number - 1).passeId;

                }
              } else {
                console.log("Zweiter Fall");

                const data: unknown = await this.spotterService.nextSet(
                  this.spotterMatches[this.match.currentMatchNumber],
                  this.match,
                  null,
                  currentPlay.number);
                // @ts-ignore
                this.spotterMatches[this.match.currentMatchNumber] = data.payload;
                let hoechsteId = 0;
                // @ts-ignore
                this.spotterMatches[this.match.currentMatchNumber].schuetzen.forEach((subListe) => {
                  if (Array.isArray(subListe)) {
                    const maxInSubListe = subListe.reduce((max, schuetze) => {
                      return schuetze.id > max ? schuetze.id : max;
                    }, 0);

                    if (maxInSubListe > hoechsteId) {
                      hoechsteId = maxInSubListe;
                    }
                  }
                });
                currentPlay.passeId = hoechsteId;
              }
            } else {
              console.log("Null passe")
              const data: unknown = await this.spotterService.nextSet(
                this.spotterMatches[this.match.currentMatchNumber],
                this.match,
                null,
                currentPlay.number);
              // @ts-ignore
              this.spotterMatches[this.match.currentMatchNumber] = data.payload;
              let hoechsteId = 0;
              console.log("Erster Fall");
              // @ts-ignore
              this.spotterMatches[this.match.currentMatchNumber].schuetzen.forEach((subListe) => {
                if (Array.isArray(subListe)) {
                  const maxInSubListe = subListe.reduce((max, schuetze) => {
                    return schuetze.id > max ? schuetze.id : max;
                  }, 0);

                  if (maxInSubListe > hoechsteId) {
                    hoechsteId = maxInSubListe;
                  }
                }
              });
              currentPlay.passeId = hoechsteId;
              console.log("PasseID", currentPlay.passeId);
            }
          }else {
            console.log("Passe Vorhanden", currentPlay.passeId)
            const data: unknown = await this.spotterService.nextSet(
              this.spotterMatches[this.match.currentMatchNumber],
              this.match,
              currentPlay.passeId,
              currentPlay.number);
            // @ts-ignore
            this.spotterMatches[this.match.currentMatchNumber] = data.payload;
          }
        } catch (error)
        {
          console.log("Error", error);
        }
        if (currentPlay) {
          currentPlay.result = this.selectedValue;

          currentPlay.final = !this.unsure;
          this.spotterService.sendPlay(currentPlay).then(() => {
            this.unsure = false;
            if (!this.match.nextPlay()) {
              this.spotting = false;
            } else {
              this.selectedPlayNumber++;
            }
            this.selectedValue = -1;
          }).catch((error: SpotterResult) => {
            this.handleError(error);
          });
        } else {
          console.error("Current play or set is not valid");
        }
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
        if (this.editedPlay !== -1) {
          const play = currentSet.play(this.editedPlay);
          if (play && play.passeId !== null) {
            console.log("Passe Vorhanden")
            const data: unknown = await this.spotterService.nextSet(
              this.spotterMatches[this.match.currentMatchNumber],
              this.match,
              play.passeId,
              play.number);
            // @ts-ignore
            this.spotterMatches[this.match.currentMatchNumber] = data.payload;
          }
        }
      }
    }
    //console.log("PasseID", this.match.set(this.match.currentSetNumber)..passeId);

    this.match.currentMatchNumber = this.currentMatchNumberTemp;
    console.log("OnSave", this.match);


    localStorage.setItem('match', JSON.stringify(this.match));

    this.checkResultIsSure();

  }

  handleError(error: SpotterResult) {
    if (error === SpotterResult.UNAUTHORIZED) {
      alert('You are not authorized to do that');
    } else {
      alert('There was an error with this request');
    }
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
    if (this.match.addSet()) {
        this.spotting = true;
        this.editing = false;
        this.selectedPlayNumber = 1;
        this.selectedValue = -1;
        this.editedPlay = -1;
        this.unsure = false;
        // @ts-ignore
        this.match.increaseCurrentSetNumber();
      }

    localStorage.setItem('match', JSON.stringify(this.match));

}

  /**
   * If the match can end (the current set is final) a confirmation will be sent to the Server
   * The server will respond with the new information for the next match (Mannschaft)
   */
  onFinishMatch() {
    this.currentMatchNumberTemp = this.match.currentMatchNumber;

    localStorage.removeItem('match');

    this.match = new Match(this.spotterMatches[this.match.currentMatchNumber].mannschaftName, this.scheibe);
    this.setMannschaftsName(this.spotterMatches[this.currentMatchNumberTemp + 1].mannschaftName);
    this.setBahn(this.scheibe);
    this.match.currentMatchNumber += this.currentMatchNumberTemp + 1;

    if (this.match.canFinish()) {


        this.spotting = true;
        this.editing = false;
        this.selectedPlayNumber = 1;
        this.selectedValue = -1;
        this.editedPlay = -1;
        this.unsure = false;
      /*}, (error: SpotterResult) => {
        if (error === SpotterResult.UNAUTHORIZED) {
          // TODO: Better error handling
          alert('You are not authorized to do that');
        } else {
          // TODO: Better error handling
          alert('There was an error with this request');
        }
      });*/

    }
    this.currentMatchNumberTemp = this.match.currentMatchNumber;

    console.log(this.spotterMatches[this.match.currentMatchNumber]);
    localStorage.setItem('match', JSON.stringify(this.match));
    console.log("this.match.currentMatchNumber", this.match.currentMatchNumber);


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
