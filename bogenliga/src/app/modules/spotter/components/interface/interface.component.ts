import { SpotterResult } from './../../types/spotter-result.enum';
import { SpotterService } from './../../services/spotter.service';
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
  matchTemp: Match;

  spotting = true;

  selectedValue = -1;

  unsure = false;

  editing = false;
  editedPlay = -1;
  allowedToSaveSet = false;

  circles: { color: string, size: number, top: number, left: number }[] = [];

  constructor(private router: Router, private spotterService: SpotterService) { }

  ngOnInit() {
    if (localStorage.getItem('match')) {
      const temp = JSON.parse(localStorage.getItem('match'));
      this.match = MatchJsonToClass.parseMatch(temp);
      this.checkResultIsSure();

      this.selectedPlayNumber = this.match.set().currentPlayNumber;
      if (this.match.set().play().result) {
        this.spotting = false;
      }
    } else {
      this.match = new Match('Nürtingen', 1);
    }

    this.generateCircles(8); // Anzahl der Kreise festlegen
  }

  generateCircles(count: number) {
    const colors = ['bla-yellow', 'bla-red', 'bla-blue', 'bla-gray'];
    for (let i = 0; i < count; i++) {
      const size = 100 - (i * 10); // Beispielgröße, die sich verringert
      const top = (100 - size) / 2;
      const left = (100 - size) / 2;
      this.circles.push({
        color: colors[i % colors.length],
        size: size,
        top: top,
        left: left
      });
    }
  }

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
    // tslint:disable-next-line:triple-equals
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
    localStorage.setItem('match', JSON.stringify(this.match));
    this.checkResultIsSure();
    // tslint:disable-next-line:triple-equals

  }

  onEdit(play: number) {
    this.selectedPlayNumber = play;
    this.editing = true;
    this.selectedValue = this.match.set().play(play).result;
    this.editedPlay = play;
  }

  onNextSet() {
    if (this.match.addSet()) {
      this.spotterService.nextSet().then(() => {
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

  onFinishMatch() {
    if (this.match.canFinish()) {

      this.spotterService.nextMatch().then((mannschaft: string) => {
        localStorage.removeItem('match');
        this.match = new Match(mannschaft, this.match.bahn);
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
  }

  onBack() {
    if (this.match.set().currentPlayNumber > 1) {
      this.onEdit(this.match.set().currentPlayNumber - 1);
    }

  }

  selectResult(selected: any) {
    this.selectedValue = selected;
    if (this.selectedValue >= 0 && this.selectedValue <= 10) {
      this.match.set().play(this.selectedPlayNumber).result = this.selectedValue;
    }
  }

  onExit() {
    localStorage.setItem('match', JSON.stringify(this.match));
    this.router.navigateByUrl('/home');
  }

  onButtonClick(s: string) {
    console.log(`Button ${s} clicked`);
  }
}
