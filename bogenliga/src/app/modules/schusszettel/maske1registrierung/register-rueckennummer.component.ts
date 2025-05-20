import {Component, Input} from '@angular/core';
import { Router } from '@angular/router';
import { SchusszettelService } from '../schusszettel.service';
import { MatchStateService } from '../match-state.service';

@Component({
  selector:    'bla-maske1registrierung',
  templateUrl: './register-rueckennummer.component.html',
  styleUrls:   ['./register-rueckennummer.component.scss']
})
export class RegisterRueckennummerComponent {
  rueckennummern: string[] = ['', '', ''];
  @Input() infos: any;
  constructor(private service: SchusszettelService, private router: Router, private state: MatchStateService) {}

  confirmInput(): void {
    this.service.confirmRueckennummern(this.rueckennummern).subscribe((success) => {
      if (success) {
        this.state.rueckennummern = this.rueckennummern;
        this.router.navigate(['/schusszettel/eingabe']);
      }
    });
  }
}
