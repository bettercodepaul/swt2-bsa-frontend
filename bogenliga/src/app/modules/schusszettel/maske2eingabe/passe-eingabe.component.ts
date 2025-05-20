import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { SchusszettelService } from '../schusszettel.service';
import { MatchStateService } from '../match-state.service';

@Component({
  selector:    'bla-maske2eingabe',
  templateUrl: './passe-eingabe.component.html',
  styleUrls:   ['./passe-eingabe.component.scss']
})
export class PasseEingabeComponent implements OnInit {
  schuesse: string[][] = [];
  @Input() infos: any;
  constructor(
    private service: SchusszettelService,
    private router: Router,
    public state: MatchStateService
  ) {}

  ngOnInit(): void {
    const arrows = this.state.arrowsPerShooter;
    this.schuesse = Array.from({ length: 3 }, () => Array(arrows).fill(''));
  }

  confirmPass() {
    this.service.submitPassData(this.schuesse).subscribe((success) => {
      if (success) {
        this.router.navigate(['/schusszettel/aktualisierung']);
      }
    });
  }
}
