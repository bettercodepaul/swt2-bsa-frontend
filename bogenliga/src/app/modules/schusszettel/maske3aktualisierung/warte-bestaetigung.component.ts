import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SchusszettelService } from '../schusszettel.service';

@Component({
  selector:    'bla-maske3aktualisierung',
  templateUrl: './warte-bestaetigung.component.html',
  styleUrls:   ['./warte-bestaetigung.component.scss']
})
export class WarteBestaetigungComponent {
  constructor(private service: SchusszettelService, private router: Router) {}

  update(): void {
    this.service.checkBothTeamsSubmitted().subscribe((ready) => {
      if (ready) {
        this.router.navigate(['/schusszettel/eingabe']);
      }
    });
  }
}
