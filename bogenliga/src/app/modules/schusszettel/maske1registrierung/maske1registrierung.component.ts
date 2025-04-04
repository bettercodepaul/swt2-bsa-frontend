import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SchusszettelService } from '../schusszettel.service';

@Component({
  selector: 'app-maske1registrierung',
  templateUrl: './maske1registrierung.component.html',
  styleUrls: ['./maske1registrierung.component.scss']
})
export class Maske1RegistrierungComponent {
  rueckennummern: string[] = ['', '', ''];

  constructor(private service: SchusszettelService, private router: Router) {}

  confirmInput() {
    this.service.confirmRueckennummern(this.rueckennummern).subscribe(success => {
      if (success) {
        this.router.navigate(['/schusszettel/eingabe']);
      }
    });
  }
}
