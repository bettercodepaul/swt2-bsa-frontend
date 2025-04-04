import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SchusszettelService } from '../schusszettel.service';

@Component({
  selector: 'app-maske3aktualisierung',
  templateUrl: './maske3aktualisierung.component.html',
  styleUrls: ['./maske3aktualisierung.component.scss']
})
export class Maske3AktualisierungComponent {
  constructor(private service: SchusszettelService, private router: Router) {}

  update() {
    this.service.checkBothTeamsSubmitted().subscribe(ready => {
      if (ready) {
        this.router.navigate(['/schusszettel/eingabe']);
      }
    });
  }
}
