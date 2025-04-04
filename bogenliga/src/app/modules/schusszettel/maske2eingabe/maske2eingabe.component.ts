import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SchusszettelService } from '../schusszettel.service';

@Component({
  selector: 'app-maske2eingabe',
  templateUrl: './maske2eingabe.component.html',
  styleUrls: ['./maske2eingabe.component.scss']
})
export class Maske2EingabeComponent {
  schuesse: string[][] = [
    ['', ''],
    ['', ''],
    ['', '']
  ];

  constructor(private service: SchusszettelService, private router: Router) {}

  confirmPass() {
    this.service.submitPassData(this.schuesse).subscribe(success => {
      if (success) {
        this.router.navigate(['/schusszettel/aktualisierung']);
      }
    });
  }
}
