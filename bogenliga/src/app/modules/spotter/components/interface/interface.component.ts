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
  TabletSession: TabletSessionProviderService;
  session: TabletSessionDO;

  constructor(private router: Router, private spotterService: SpotterService, private tabletSession: TabletSessionProviderService ) {
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
      this.scheibe = parseInt(urlParts.schreibe, 10); // Added base 10 for parseInt
    } catch (error) {
      console.error("Fehler beim Parsen von WettkampfId und Scheibe Nummer", error);
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
      console.error("Fehler beim Abrufen der Matches:", error); }

    for (const element of this.matchDOs) {
      if (element.matchScheibennummer === this.scheibe) {
        this.spotterMatches.push(element);
      }
    }
    this.setMannschaftsName(this.spotterMatches[this.match.currentMatchNumber].mannschaftName);
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
