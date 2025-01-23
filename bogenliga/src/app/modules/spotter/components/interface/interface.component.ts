import { SpotterResult } from './../../types/spotter-result.enum';
import { SpotterService } from './../../services/spotter.service';
import { MatchJsonToClass } from './../../mapper/match-json-to-class.mapper';
import { Router } from '@angular/router';
import { Match } from './../../types/match';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';
import {MatchDOExt} from "@wkdurchfuehrung/types/match-do-ext.class";
import {BogenligaResponse, RequestResult} from '@shared/data-provider';
import {TabletSessionDO} from '@wkdurchfuehrung/types/tablet-session-do.class';
import {Session} from 'protractor';
import {TabletSessionProviderService} from '@wkdurchfuehrung/services/tablet-session-provider.service';

@Component({
  selector: 'bla-interface',
  templateUrl: './interface.component.html',
  styleUrls: ['./interface.component.scss']
})
export class InterfaceComponent implements OnInit, OnDestroy{

  faArrowCircleLeft = faArrowCircleLeft;

  selectedPlayNumber = 1;

  matchLS: Match;
  matchLSTemp: Match;
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
  TabletSession: TabletSessionProviderService;
  session: TabletSessionDO;
  private finish: boolean;

  constructor(private router: Router, private spotterService: SpotterService, private tabletSession: TabletSessionProviderService ) {
    this.spotterMatches = [];
    this.matchDOs = [];
  }

  ngOnInit() {
    if (localStorage.getItem('match') !== null) {
      const temp = JSON.parse(localStorage.getItem('match'));
      this.matchLS = MatchJsonToClass.parseMatch(temp);
      this.currentMatchNumberTemp = this.matchLS.currentMatchNumber;
      this.checkResultIsSure();

      this.selectedPlayNumber = this.matchLS.set().currentPlayNumber;
      if (this.matchLS.set().play().result) {
        this.spotting = true;
      }
    } else {
      this.matchLS = new Match('', 1);
      this.matchLS.currentMatchNumber = 0;
    }
    console.log(this.matchLS);
    const urlParts = this.spotterService.getWettkampfIDundScheibe();
    try {
      this.wkID = urlParts.wkId;
      this.scheibe = parseInt(urlParts.schreibe);
    } catch (error) {
      console.error("Fehler beim parsen von WettkampfId und Scheibe Nummer", error);
    }
    console.log("tabletsession:", this.tabletSession); // Check here if it's still undefined
    // Fetch tablet session with wkID and scheibe
    this.fetchTabletSession(this.wkID, this.scheibe);
    this.initMatches();
  }

  private fetchTabletSession(wkID: string, scheibe: number) {
    // Now, tabletSession should be properly defined
    if (this.tabletSession) {
      this.tabletSession.findTabletSession(wkID, scheibe.toString())
          .then((response) => {
            if (response.result === RequestResult.SUCCESS) {
              this.session = response.payload;
              console.log("Session fetched successfully:", this.session);

              // Check session state
              this.handleSessionState(this.session.isActive);
            } else {
              console.error("Failed to fetch the session:", response);
            }
          })
          .catch(error => {
            console.error("Error fetching the session:", error);
          });
    } else {
      console.error("tabletSession service is not defined!");
    }
  }
  private handleSessionState(isActive: boolean) {
    if (isActive == null || !isActive) {
      // If the session is not active (null or false), block the page load
      alert(`Session for Scheibe ${this.scheibe} and Wettkampf ${this.wkID} is already active.`);
      console.log(`Session for Scheibe ${this.scheibe} and Wettkampf ${this.wkID} is already active.`);
      // Redirect to a blocked page or show a message, depending on your flow
      this.router.navigate(['/blocked']);  // This can be a page where users are informed
    } else {
      // If the session is active, allow loading and set it to true
      console.log('Session is active, allowing page load.');
      this.initMatches(); // Load the page content
      this.tabletSession.toggleSessionActiveState(this.session,  false).then(() => {
        console.log('Session set to inactive (false) on page load');
      }).catch((error) => {
        console.error('Error setting session to inactive:', error);
      });
    }
  }
  private async initMatches() {
    try {
      const data: unknown = await this.spotterService.findMatch(this.wkID);
      // @ts-ignore
      this.matchDOs = data.payload;
    } catch (error) {
      console.error("Fehler beim Abrufen der Matches:", error);
    }

    for (const element of this.matchDOs) {
      if (element.matchScheibennummer === this.scheibe) {
        this.spotterMatches.push(element);
      }
    }
    this.setMannschaftsName(this.spotterMatches[this.matchLS.currentMatchNumber].mannschaftName);
    this.setBahn(this.scheibe);
  }
  ngOnDestroy() {
    // When leaving the page, set the session to active (true) again
    if (this.session) {
      this.tabletSession.toggleSessionActiveState(this.session, true).then(() => {
        console.log('Session set back to active (true) when leaving the page');
      }).catch(error => {
        console.error('Error setting session back to active:', error);
      });
    }
  }

  setMannschaftsName(name: string) {
    this.matchLS.mannschaft = name;
  }

  setBahn(scheibe: number) {
    this.matchLS.bahn = scheibe;
  }

  checkResultIsSure(): boolean {
    const temp = JSON.parse(localStorage.getItem('match'));
    this.matchLSTemp = MatchJsonToClass.parseMatch(temp);

    this.allowedToSaveSet = false;
    if (this.checkAllPointsScored()) {
      for (let i = 1; i < 7; i++) {
        if (!this.matchLSTemp.set().play(i).final) {
          this.allowedToSaveSet = true;
        }
      }
    }
    return this.allowedToSaveSet;
  }
  checkAllPointsScored(): boolean {
    let pointsAreScored = true;
    for (let i = 0; i < 6 && pointsAreScored; i++) {
      if (this.matchLSTemp.set().plays[i].result === undefined) {
        pointsAreScored = false;
      }
    }
    return pointsAreScored;
  }

  /**
   * Saves current selected value to result of current play of current set if not editing
   * Changes result of selected play of current set if editing
   */

  async triggerBackendRequest(matchDOExt: MatchDOExt, passeID: number, tagretZielScheibenNumber: number) {
    try {
      const data: unknown = await this.spotterService.nextSet(
        matchDOExt,
        this.matchLS,
        passeID,
        tagretZielScheibenNumber
      );
      // @ts-ignore
      this.spotterMatches[this.matchLS.currentMatchNumber] = data.payload;
    } catch (error) {
      console.log('Fehler beim eintragen in die Datenbank: ', error);
    }
  }
  public findHighestPasseID(matchDO: MatchDOExt[], currentMatchNumber) {
    let hoechsteId = 0;

    matchDO[currentMatchNumber].schuetzen.forEach((subListe) => {
      if (Array.isArray(subListe)) {
        const maxInSubListe = subListe.reduce((max, schuetze) => {
          return schuetze.id > max ? schuetze.id : max;
        }, 0);

        if (maxInSubListe > hoechsteId) {
          hoechsteId = maxInSubListe;
        }
      }
    });
    return hoechsteId;
  }

  async onSave() {
    const currentSet = this.matchLS.set();
    const currentPlay = currentSet ? currentSet.play() : null;
    const currentMatchDO = this.spotterMatches[this.matchLS.currentMatchNumber];
    let currentPointNumber = 0;
    // Handles new Point
    if (!this.editing) {
      // Check if it's a valid Point
      if (this.selectedValue >= 0 && this.selectedValue <= 10) {

        try {
          // Check if current play has already a passeID
          if (!currentPlay.passeId) {
            // Check if it's the first point
            if (currentPlay.number > 1) {
              // Check if current Point is even number
              if (currentPlay.number % 2 === 0) {
                // => If yes it must have a passeID from the predecessor
                if (this.matchLS.set().play(currentPlay.number - 1).passeId) {
                  const prePasseID = this.matchLS.set().play(currentPlay.number - 1).passeId;
                  currentPointNumber = currentPlay.number;

                  await this.triggerBackendRequest(currentMatchDO, prePasseID, currentPointNumber);
                  // Set the same passeID for predecessor Point
                  currentPlay.passeId = this.matchLS.set().play(currentPlay.number - 1).passeId;
                }
              } else {
                // Case: odd tagretZielScheibenNumber without PasseID
                // Because odd Number shoud have not a passeID in this case
                currentPointNumber = currentPlay.number;
                await this.triggerBackendRequest(currentMatchDO, null, currentPointNumber);

                // Now we want to save PasseID from the current Point we added
                // For that we need find the highest passeID
                currentPlay.passeId = this.findHighestPasseID(this.spotterMatches, this.matchLS.currentMatchNumber);
              }
            } else {
              // Case: It's the first Point => can't have already a PasseID
              await this.triggerBackendRequest(currentMatchDO, null, currentPlay.number);
              currentPlay.passeId = this.findHighestPasseID(this.spotterMatches, this.matchLS.currentMatchNumber);
            }
          } else {
            // Case: PasseID is already exiting for this Point
            await this.triggerBackendRequest(currentMatchDO, currentPlay.passeId, currentPlay.number);
          }
        } catch (error) {
          console.log("Error beim hinzufügen der Passe ID", error);
        }
        // Set the data in Local Storage Cache
        if (currentPlay) {
          currentPlay.result = this.selectedValue;

          currentPlay.final = !this.unsure;
          this.spotterService.sendPlay(currentPlay).then(() => {
            this.unsure = false;
            if (!this.matchLS.nextPlay()) {
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
        // Set the data in Local Storage Cache

        this.matchLS.set().play(this.editedPlay).result = this.selectedValue;
        this.matchLS.set().play(this.editedPlay).final = true;
        if (this.spotting) {
          this.matchLS.set().play(this.editedPlay).final = !this.unsure;
        }
        this.spotterService.sendPlay(this.matchLS.set().play(this.editedPlay)).then(() => {
          if (!this.spotting) {
            this.spotting = false;
          } else {
            this.onEdit(this.matchLS.set().currentPlayNumber);
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
          // If you're editing a number it already has a passeID
          const play = currentSet.play(this.editedPlay);
          if (play && play.passeId !== null) {
            this.triggerBackendRequest(currentMatchDO, play.passeId, play.number);
          }
        }
      }

      let control = true;
      for (let i=0; i < 6; i++){
        if(currentSet.play(i).final == null)
        {
          control = false;
        }
      }
      if(control === true && this.finish === false)
      {
        this.finish = true;
      }
    }

    this.matchLS.currentMatchNumber = this.currentMatchNumberTemp;

    localStorage.setItem('match', JSON.stringify(this.matchLS));

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
    this.selectedValue = this.matchLS.set().play(play).result;
    this.editedPlay = play;
    if(play === 6){
      this.finish = true;
    }
  }

  /**
   * If everything is final, create new set and send confirmation to backend, that set is finished
   */
  onNextSet() {
    console.log(this.matchLS);
    if (this.matchLS.addSet()) {
      this.spotting = true;
      this.editing = false;
      this.selectedPlayNumber = 1;
      this.selectedValue = -1;
      this.editedPlay = -1;
      this.unsure = false;
      // @ts-ignore
      this.matchLS.increaseCurrentSetNumber();
    }

    localStorage.setItem('match', JSON.stringify(this.matchLS));
    this.finish = false;
  }

  /**
   * If the match can end (the current set is final) a confirmation will be sent to the Server
   * The server will respond with the new information for the next match (Mannschaft)
   */
  onFinishMatch() {
    this.currentMatchNumberTemp = this.matchLS.currentMatchNumber;

    localStorage.removeItem('match');

    this.matchLS = new Match(this.spotterMatches[this.matchLS.currentMatchNumber].mannschaftName, this.scheibe);
    this.setMannschaftsName(this.spotterMatches[this.currentMatchNumberTemp + 1].mannschaftName);
    this.setBahn(this.scheibe);
    this.matchLS.currentMatchNumber += this.currentMatchNumberTemp + 1;

    if (this.matchLS.canFinish()) {


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
    this.currentMatchNumberTemp = this.matchLS.currentMatchNumber;

    console.log(this.spotterMatches[this.matchLS.currentMatchNumber]);
    localStorage.setItem('match', JSON.stringify(this.matchLS));
    console.log("this.match.currentMatchNumber", this.matchLS.currentMatchNumber);


  }

  /**
   * Allows the spotter to directly go back to the previous play
   */
  onBack() {
    if (this.matchLS.set().currentPlayNumber > 1) {
      this.onEdit(this.matchLS.set().currentPlayNumber - 1);
    }

  }

  /**
   * sets the selected result from the user interface
   * @param selected selected result
   */
  selectResult(selected: any) {
    this.selectedValue = selected;
    if (this.selectedValue >= 0 && this.selectedValue <= 10) {
      this.matchLS.set().play(this.selectedPlayNumber).result = this.selectedValue;
    }
    this.onSave();

  }

  /**
   * Redirects the spotter to the home page while maintaining the current match if not finished
   */
  onExit() {
    localStorage.setItem('match', JSON.stringify(this.matchLS));
    this.router.navigateByUrl('/home');
  }

}
