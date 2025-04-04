import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchStateService } from '../match-state.service';

@Component({
  selector: 'bla-schusszettel-init',
  template: '<p>Initialisiere Schusszettel...</p>'
})
export class SchusszettelInitComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private state: MatchStateService
  ) {}

  ngOnInit(): void {
    const matchIdParam = this.route.snapshot.queryParamMap.get('matchId');
    const teamParam = this.route.snapshot.queryParamMap.get('team');

    const matchId = matchIdParam ? parseInt(matchIdParam, 10) : NaN;
    const team = teamParam?.toUpperCase() === 'B' ? 'B' : 'A';

    if (!isNaN(matchId)) {
      this.state.matchId = matchId;
      this.state.isTeamA = team === 'A';
      this.router.navigate(['/schusszettel/registrierung']);
    } else {
      console.error('Ungültiger oder fehlender QR-Code-Parameter. Registrierung wird abgebrochen.');
    }
  }
}

