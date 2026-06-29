import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'bla-tabelle-ergebnis-letzte-match',
  templateUrl: './tabelle-ergebnis-letzte-match.component.html',
  styleUrls: ['./tabelle-ergebnis-letzte-match.component.scss']
})
export class TabelleErgebnisLetzteMatchComponent implements OnInit, OnDestroy {

  currentTime: string;
  isFullscreen = true;
  private timeSubscription: Subscription;

  matchName = 'Match X';
  team1Name = 'Verein 1';
  team2Name = 'Verein 2';

  team1Scores = ['10', '9', 'x', '2', '3', '3'];
  team2Scores = ['10', '9', 'x', '3', '4', '6'];

  team1Total = 37;
  team2Total = 42;

  team1SetPoints = 3;
  team2SetPoints = 3;

  constructor() { }

  ngOnInit(): void {
    this.startClock();
    this.activateFullscreen();
  }

  ngOnDestroy(): void {
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
  }

  startClock(): void {
    const updateTime = () => {
      this.currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
    };
    updateTime();
    this.timeSubscription = interval(1000).subscribe(() => updateTime());
  }

  private activateFullscreen(): void {
    const element = document.documentElement;

    if (element.requestFullscreen) {
      element.requestFullscreen().catch((err) => {
        console.warn('Vollbild-Anfrage fehlgeschlagen:', err);
      });
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      this.isFullscreen = false;
    }
  }
}
